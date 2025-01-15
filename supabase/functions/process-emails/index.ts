import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// SMTP Configuration
const SMTP_HOSTNAME = Deno.env.get('SMTP_HOSTNAME')!
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587')
const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME')!
const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD')!
const FROM_EMAIL = Deno.env.get('FROM_EMAIL')!

const smtp = new SmtpClient();

serve(async (req) => {
  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get pending emails
    const { data: emails, error: fetchError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(10)

    if (fetchError) throw fetchError

    if (!emails || emails.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending emails' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Connect to SMTP server
    await smtp.connectTLS({
      hostname: SMTP_HOSTNAME,
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
    });

    // Process each email
    for (const email of emails) {
      try {
        await smtp.send({
          from: FROM_EMAIL,
          to: email.to_email,
          subject: email.subject,
          content: email.html_content,
          html: email.html_content,
        });

        // Update email status to sent
        await supabase
          .from('email_queue')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', email.id)

      } catch (error) {
        console.error(`Failed to send email ${email.id}:`, error)
        
        // Update email status to failed
        await supabase
          .from('email_queue')
          .update({ 
            status: 'failed',
            error: error.message
          })
          .eq('id', email.id)
      }
    }

    await smtp.close();

    return new Response(JSON.stringify({ 
      message: `Processed ${emails.length} emails`
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error processing emails:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
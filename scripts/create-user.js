const supabaseUrl = 'https://krzxrbihzczksctuefsm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyenhyYmloemN6a3NjdHVlZnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MjM4MTcsImV4cCI6MjA4MjQ5OTgxN30.j4RHI7jmk5WBo11yMyj8b1uNe3JJ9mKTokqeaawRZ5g';

async function createUser() {
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'admin@ernest.io',
            password: 'Ernest2025!',
            data: {
                full_name: 'Othman Serraj'
            }
        })
    });

    const data = await response.json();
    if (response.ok) {
        console.log('SUCCESS: Account provisioned.');
    } else {
        console.log('ERROR:', data.msg || data.error_description || JSON.stringify(data));
    }
}

createUser();

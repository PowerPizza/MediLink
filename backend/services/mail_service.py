from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from config import getSettings
from pydantic import EmailStr, NameEmail

settings = getSettings()

conf = ConnectionConfig(
    MAIL_USERNAME=settings.sender_mail,
    MAIL_FROM=settings.sender_mail,
    MAIL_PASSWORD=settings.sender_mail_password,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_SSL_TLS=False,
    MAIL_STARTTLS=True
)
print("Creating SMTP connection...")
mailing_server = FastMail(conf)
print("SMTP Connection created successfully.")

async def sendVerificationCode(to: str, code: str):
    template = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            *{{
                margin:0;
                padding:0;
                box-sizing:border-box;
                font-family:Arial, Helvetica, sans-serif;
            }}
            body{{
                padding: 4px;
                background:#f3f3f3;
                display:flex;
                justify-content:center;
                align-items:center;
                min-height:100vh;
            }}
            .container{{
                width:100%;
                background:#d8f2d3;
                border:2px solid #27c85a;
                border-radius:14px;
                overflow:hidden;
                box-shadow:0 4px 10px rgba(0,0,0,0.15);
            }}
        
            .header{{
                background:#00c65a;
                text-align:center;
                padding:20px 10px;
                border-bottom:2px solid black;
            }}
            
            .header h1{{
                color:white;
                margin-bottom:10px;
            }}
            .header p{{
                color:#f1f1f1;
                font-size:16px;
                font-weight:600;
            }}
            .content{{
                padding:18px;
            }}
            .message-box{{
                background:#f5f5f5;
                border:1px solid #4fd16d;
                border-radius:10px;
                padding:22px 16px;
                margin-bottom:35px;
            }}
            .message-box p{{
                color:#111;
                font-size:17px;
                font-weight:700;
                line-height:2;
            }}
            .code-box{{
                width:220px;
                margin:0 auto;
                padding:18px;
                border:2px dashed #00c65a;
                border-radius:16px;
                text-align:center;
                background:#ffffff;
                font-size:18px;
                font-weight:700;
                color:#111;
            }}
            .line{{
                width:240px;
                height:2px;
                background:#777;
                margin:18px auto 70px;
            }}
            .info{{
                text-align:center;
                font-size:18px;
                color:#111;
                margin-bottom:18px;
            }}
            .footer-line{{
                width:380px;
                height:2px;
                background:#777;
                margin:0 auto 18px;
            }}
            .footer{{
                text-align:center;
                padding-bottom:20px;
            }}
            .footer p{{
                color:#777;
                font-size:16px;
                margin-bottom:8px;
            }}
            .footer h3{{
                color:#000;
                font-size:20px;
                font-weight:800;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verification Code</h1>
                <p>Secure Access Code</p>
            </div>
            <div class="content">
                <div class="message-box">
                    <p>Hello,</p>
                    <br>
                    <p>
                        Use the verification code below to continue your sign in
                        Process.....
                    </p>
                </div>
                <div class="code-box">
                    {code}
                </div>
                <div class="line"></div>
                <div class="info">
                    If you didn’t request this code, you can safely ignore it.
                </div>
                <div class="footer-line"></div>
                <div class="footer">
                    <p>Best Regards</p>
                    <h3>Team Medilink</h3>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    message = MessageSchema(
        recipients=[NameEmail("", to)],
        subject="Verification Code",
        body=template,
        subtype=MessageType.html
    )

    await mailing_server.send_message(message)

if __name__ == '__main__':
    import asyncio
    asyncio.run(sendVerificationCode("goatbale@gmail.com", "1221"))

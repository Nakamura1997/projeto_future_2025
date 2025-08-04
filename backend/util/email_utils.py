from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from email.mime.image import MIMEImage
import os


def enviar_email_boas_vindas(
    destinatario_email, token, site_url=None, nome_usuario=None
):
    if not site_url:

        site_url = "http://35.239.165.7:3000/"


    assunto = "🔐 Seja bem-vindo ao FS3M"
    link_definir_senha = f"{site_url}/cadastro/{token}"

    saudacao = f"Olá {nome_usuario}!" if nome_usuario else "Olá!"

    texto_simples = f"""
{saudacao}

Seja bem-vindo ao FS3M - Future Security Maturity Monitoring & Management!

Sua conta foi criada com sucesso! Para garantir a segurança do seu acesso e 
finalizar seu cadastro, é necessário definir sua senha personalizada.

Para definir sua senha, acesse: {link_definir_senha}

Este link é válido por 24 horas por motivos de segurança.

Precisa de ajuda? Entre em contato conosco.

Não foi você quem solicitou? Ignore este e-mail com segurança.

© 2024 Future Security. Todos os direitos reservados.
    """

    html_content = f"""
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao FS3M</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
        
        <!-- Logo centralizado -->
        <div style="text-align: center; padding: 32px 0; background-color: #fafafa;">
            <img src="cid:logo_image" alt="Future Security Logo" style="max-width: 250px; height: auto;"/>
        </div>

        <!-- Conteúdo principal -->
        <div style="padding: 48px 32px; text-align: center;">
            <h1 style="font-size: 28px; font-weight: bold; color: #374151; margin: 0 0 16px 0;">
                {saudacao}
            </h1>
            <p style="color: #4b5563; font-size: 16px; margin: 0 0 8px 0;">
                Seja bem-vindo ao <strong>FS3M</strong>
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 32px 0;">
                Future Security Maturity Monitoring & Management
            <p style="color: #374151; line-height: 1.6; margin: 0 0 32px 0; font-size: 16px;">
                                Sua conta foi criada com sucesso! Para garantir a segurança do seu acesso e finalizar seu cadastro, é necessário definir sua senha personalizada.
            </p>
            
            <a href="{link_definir_senha}" 
               style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); 
                      color: white; 
                      padding: 16px 32px; 
                      border-radius: 8px; 
                      text-decoration: none; 
                      font-weight: 600; 
                      font-size: 18px; 
                      display: inline-block;
                      box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);
                      transition: all 0.2s ease;">
                Definir minha senha
            </a>
            
            <p style="font-size: 14px; color: #6b7280; margin: 32px 0 0 0;">
                Se não foi você quem solicitou, ignore este e-mail.
            </p>
        </div>

        <!-- Footer simples -->
        <div style="background-color: #f9fafb; padding: 24px 32px; text-align: center;">
            <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0;">
                <strong>Precisa de ajuda?</strong> Entre em contato conosco
            </p>
            
            <!-- Links das redes sociais em texto simples -->
            <div style="margin: 16px 0;">
                <p style="font-size: 11px; color: #9ca3af; margin: 4px 0;">
                    <a href="https://www.facebook.com/futuretechnologiesbr" style="color: #f97316; text-decoration: none;">Facebook</a> | 
                    <a href="https://www.instagram.com/futuretechbr/" style="color: #f97316; text-decoration: none;">Instagram</a> | 
                    <a href="https://www.linkedin.com/company/futuretechnologiesbr/posts/?feedView=all" style="color: #f97316; text-decoration: none;">LinkedIn</a> | 
                    <a href="https://www.youtube.com/@futuretechbr" style="color: #f97316; text-decoration: none;">YouTube</a>
                </p>
            </div>
            
            <p style="font-size: 12px; color: #9ca3af; margin: 8px 0 0 0;">
                © 2024 Future Technologies. Todos os direitos reservados.
            </p>
        </div>
    </div>
</body>
</html>
    """

    email = EmailMultiAlternatives(
        assunto,
        texto_simples.strip(),
        settings.DEFAULT_FROM_EMAIL,
        [destinatario_email],
    )
    email.attach_alternative(html_content, "text/html")

    # Anexa logo local inline
    caminho_logo = os.path.join(os.path.dirname(__file__), "LogoFutureHorizontal.png")
    with open(caminho_logo, "rb") as img_file:
        img = MIMEImage(img_file.read())
        img.add_header("Content-ID", "<logo_image>")
        img.add_header(
            "Content-Disposition", "inline", filename="LogoFutureHorizontal.png"
        )
        email.attach(img)

    email.send(fail_silently=False)

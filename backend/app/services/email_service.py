"""
Email Service for automated campaigns
Supports welcome emails, abandoned cart, product recommendations
"""

from typing import List, Dict
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os


class EmailService:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@aipersona.com")
        self.from_name = os.getenv("FROM_NAME", "AI Persona")
        
    def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send an email"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Connect and send
            if not self.smtp_user or not self.smtp_password:
                print("⚠️  SMTP credentials not configured, email not sent")
                return False
                
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
                
            print(f"✅ Email sent to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Email error: {str(e)}")
            return False
    
    def send_welcome_email(self, user_email: str, user_name: str) -> bool:
        """Send welcome email to new users"""
        subject = "Welcome to AI Persona! 🎉"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }}
                .feature {{ background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }}
                .footer {{ text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to AI Persona! 🎉</h1>
                </div>
                <div class="content">
                    <p>Hi {user_name},</p>
                    
                    <p>We're thrilled to have you join AI Persona! Get ready to discover personalized product recommendations powered by artificial intelligence.</p>
                    
                    <h2>Here's what you can do:</h2>
                    
                    <div class="feature">
                        <strong>🐾 Create Profiles</strong><br>
                        Set up profiles for your pets, babies, or family members with specific needs, allergies, and preferences.
                    </div>
                    
                    <div class="feature">
                        <strong>🤖 AI-Powered Recommendations</strong><br>
                        Get personalized product matches with detailed AI analysis including pros, cons, and safety warnings.
                    </div>
                    
                    <div class="feature">
                        <strong>⚖️ Compare Products</strong><br>
                        Select up to 4 products and compare them side-by-side with AI insights tailored to your profile.
                    </div>
                    
                    <div class="feature">
                        <strong>❤️ Save Favorites</strong><br>
                        Build wishlists and save products for later purchase.
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="https://aipersona.com/profiles" class="button">Create Your First Profile</a>
                    </div>
                    
                    <p>Need help? Check out our <a href="https://aipersona.com/faq">FAQ page</a> or reply to this email.</p>
                    
                    <p>Happy shopping!<br>
                    The AI Persona Team</p>
                </div>
                <div class="footer">
                    © {datetime.now().year} AI Persona. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(user_email, subject, html_content)
    
    def send_profile_created_email(self, user_email: str, profile_name: str, profile_category: str) -> bool:
        """Send confirmation email when profile is created"""
        subject = f"Profile Created: {profile_name} 🎯"
        
        category_emoji = {
            'dog': '🐕',
            'cat': '🐱',
            'baby': '👶',
            'human': '👤'
        }
        
        emoji = category_emoji.get(profile_category, '✨')
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; }}
                .button {{ display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>{emoji} Profile Created!</h1>
                </div>
                <div class="content">
                    <p>Great news!</p>
                    
                    <p>Your profile for <strong>{profile_name}</strong> has been successfully created.</p>
                    
                    <p>Our AI is now ready to provide personalized {profile_category} product recommendations based on their unique needs and preferences.</p>
                    
                    <div style="text-align: center;">
                        <a href="https://aipersona.com/products" class="button">Browse Personalized Products</a>
                    </div>
                    
                    <p>You can update this profile anytime or create additional profiles for other family members or pets.</p>
                    
                    <p>Happy shopping!<br>
                    The AI Persona Team</p>
                </div>
                <div class="footer">
                    © {datetime.now().year} AI Persona. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(user_email, subject, html_content)
    
    def send_recommendation_email(self, user_email: str, user_name: str, products: List[Dict]) -> bool:
        """Send weekly personalized product recommendations"""
        subject = "New Products You'll Love! 💝"
        
        product_html = ""
        for product in products[:5]:  # Top 5 products
            product_html += f"""
            <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h3 style="margin-top: 0; color: #1f2937;">{product.get('name')}</h3>
                <p style="color: #6b7280; margin: 5px 0;"><strong>{product.get('brand')}</strong></p>
                <p style="color: #059669; font-size: 20px; font-weight: bold; margin: 10px 0;">${product.get('price', 0):.2f}</p>
                <p style="color: #4b5563;">{product.get('description', '')[:150]}...</p>
                <a href="https://aipersona.com/product/{product.get('id')}" style="display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Product</a>
            </div>
            """
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; }}
                .footer {{ text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>💝 Personalized Picks for You</h1>
                </div>
                <div class="content">
                    <p>Hi {user_name},</p>
                    
                    <p>Based on your profiles and preferences, we've handpicked these products just for you:</p>
                    
                    {product_html}
                    
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="https://aipersona.com/products" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">Browse All Products</a>
                    </p>
                    
                    <p>Happy shopping!<br>
                    The AI Persona Team</p>
                </div>
                <div class="footer">
                    <a href="https://aipersona.com/settings/unsubscribe">Unsubscribe</a> from marketing emails<br>
                    © {datetime.now().year} AI Persona. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(user_email, subject, html_content)
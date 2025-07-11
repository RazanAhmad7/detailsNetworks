namespace DetailsNetworks.Services
{
    using MailKit.Net.Smtp;
    using MimeKit;
    using MailKit.Security;

    public class EmailSender
    {
        private readonly IConfiguration _config;

        public EmailSender(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmail(string toEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _config["Email:FromName"],
                _config["Email:FromEmail"]));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = body };

            using var client = new SmtpClient();

            // Explicit SSL/TLS configuration
            var useSsl = bool.Parse(_config["Email:UseSsl"]);
            var secureSocketOption = useSsl ? SecureSocketOptions.SslOnConnect
                                          : SecureSocketOptions.StartTls;

            await client.ConnectAsync(
                _config["Email:Server"],
                int.Parse(_config["Email:Port"]),
                secureSocketOption);

            await client.AuthenticateAsync(
                _config["Email:Username"],
                _config["Email:Password"]);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}

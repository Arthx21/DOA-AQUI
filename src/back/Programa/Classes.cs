namespace Classes
{
    using System.Threading.Tasks;
    using System;
    using SendGrid;
    using SendGrid.Helpers.Mail;

    public static class EmailService
    {
        private const string ApiKey = "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"; // coloque a nova chave aqui

        public static async Task EnviarAsync(string para, string assunto, string corpoHtml)
        {
            var client = new SendGridClient(ApiKey);
            var from = new EmailAddress("doaaqui.mailservice@gmail.com", "Arthur");
            var to = new EmailAddress(para);
            var msg = MailHelper.CreateSingleEmail(from, to, assunto, plainTextContent: null, htmlContent: corpoHtml);

            var response = await client.SendEmailAsync(msg);

            if (response.StatusCode != System.Net.HttpStatusCode.Accepted)
            {
                Console.WriteLine($"Erro ao enviar e-mail. Código: {response.StatusCode}");
                var body = await response.Body.ReadAsStringAsync();
                Console.WriteLine(body);
            }
            else
            {
                Console.WriteLine("E-mail enviado com sucesso!");
            }
        }
    }


    class Login
    {
        public string? Email { get; set; }
        public string? Senha { get; set; }
    }
    class Pessoa
    {
        public int Idpessoa { get; set; }
        public string? Tipo { get; set; }
        public string? Nome { get; set; }
        public string? Telefone { get; set; }
        public string? Senha { get; set; }
        public string? Email { get; set; }
    }

    class Doador : Pessoa
    {
        public int Iddoador { get; set; }
    }

    class Receptor : Pessoa
    {
        public int Idreceptor { get; set; }
    }


    class ONG : Pessoa
    {
        public int Idong { get; set; }
        public string? NomeDaOng { get; set; }
        public Endereco? endereco { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }

    class Endereco
    {
        public string? Rua { get; set; }
        public string? Numero { get; set; }
        public string? Bairro { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
    }

    class Roupa
    {
        public int Idroupa { get; set; }
        public int Iddoador { get; set; }
        public int Idong { get; set; }
        public string? Tipo { get; set; }
        public string? Tamanho { get; set; }
        public string? Cor { get; set; }
        public string? Genero { get; set; }
        public string? Descricao { get; set; }
        public string? Foto { get; set; }
        public string? Status { get; set; } // Pendente, Disponível, Doada (ESPECIFICAMENTE NESSA ORDEM) 
    }

}
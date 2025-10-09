namespace Classes
{
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
        public string? Cep { get; set; }
    }

    class Roupa
    {
        public int Idroupa { get; set; }
        public int Iddoador { get; set; }
        public string? Tipo { get; set; }
        public string? Tamanho { get; set; }
        public string? Cor { get; set; }
        public string? Genero { get; set; }
        public string? Descricao { get; set; }

        public string? Foto { get; set; }
        
    }

}
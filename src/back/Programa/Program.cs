using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using MySqlConnector;

using Classes;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI();

string connectionString = "Server=mysql-e51083d-doaaqui.k.aivencloud.com;" +
                          "Port=26584;" + 
                          "Database=doaaquiDB;" +
                          "User ID=avnadmin;" +
                          "Password=AVNS_nIqBD4P6y_dcBlXxHZO;" +
                          "SslMode=Required;" +
                          "SslCa=ca.pem;";

// GET /TestarConexao
app.MapGet("/TestarConexao", async () =>
{
    try
    {
        using var conn = new MySqlConnection(connectionString);
        await conn.OpenAsync();
        return Results.Ok("✅ Conexão com o banco de dados esttabelecida com sucesso!");
    }
    catch (Exception ex)
    {
        return Results.Problem($"❌ Falha ao conectar ao banco de dados: {ex.Message}");
    }
});


// GET /doador
app.MapGet("/ListarDoador", async () =>
{
    var doadores = new List<object>();
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    using var cmd = new MySqlCommand(@"SELECT p.idpessoa AS idpessoa, d.iddoador AS iddoador, p.nome AS nome, p.telefone AS telefone, p.email AS email, p.senha AS senha
                                   FROM Pessoa p
                                   JOIN Doador d ON p.idpessoa = d.iddoador;", conn);
    using var reader = await cmd.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        doadores.Add(new
        {
            idpessoa = reader["idpessoa"],
            iddoador = reader["iddoador"],
            nome = reader["nome"],
            telefone = reader["telefone"],
            email = reader["email"],
            Senha = reader["senha"]
        });
    }

    return Results.Ok(doadores);
});

// POST /doador
app.MapPost("/CadastrarDoador", async (Pessoa pessoa) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var sqlPessoa = "INSERT INTO Pessoa (nome, telefone, senha, email) VALUES (@nome, @telefone, @senha, @email)";
    using var cmdPessoa = new MySqlCommand(sqlPessoa, conn);
    cmdPessoa.Parameters.AddWithValue("@nome", pessoa.Nome);
    cmdPessoa.Parameters.AddWithValue("@telefone", pessoa.Telefone);
    cmdPessoa.Parameters.AddWithValue("@senha", pessoa.Senha);
    cmdPessoa.Parameters.AddWithValue("@email", pessoa.Email);

    await cmdPessoa.ExecuteNonQueryAsync();

    long idGerado = cmdPessoa.LastInsertedId;

    var sqlDoador = "INSERT INTO Doador (iddoador) VALUES (@iddoador)";
    using var cmdDoador = new MySqlCommand(sqlDoador, conn);
    cmdDoador.Parameters.AddWithValue("@iddoador", idGerado);

    await cmdDoador.ExecuteNonQueryAsync();

    return Results.Ok($"Pessoa e Doador cadastrados! ID = {idGerado}");
});

// POST /receptor
app.MapPost("/CadastrarReceptor", async (Pessoa pessoa) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var sqlPessoa = "INSERT INTO Pessoa (nome, telefone, senha, email) VALUES (@nome, @telefone, @senha, @email)";
    using var cmdPessoa = new MySqlCommand(sqlPessoa, conn);
    cmdPessoa.Parameters.AddWithValue("@nome", pessoa.Nome);
    cmdPessoa.Parameters.AddWithValue("@telefone", pessoa.Telefone);
    cmdPessoa.Parameters.AddWithValue("@senha", pessoa.Senha);
    cmdPessoa.Parameters.AddWithValue("@email", pessoa.Email);

    await cmdPessoa.ExecuteNonQueryAsync();

    long idGerado = cmdPessoa.LastInsertedId;

    var sqlReceptor = "INSERT INTO Receptor (idreceptor) VALUES (@idreceptor)";
    using var cmdReceptor = new MySqlCommand(sqlReceptor, conn);
    cmdReceptor.Parameters.AddWithValue("@idreceptor", idGerado);

    await cmdReceptor.ExecuteNonQueryAsync();

    return Results.Ok($"Pessoa e Receptor cadastrados! ID = {idGerado}");
});

// POST /ong

app.MapPost("/CadastrarOng", async (ONG ong) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var sqlPessoa = "INSERT INTO Pessoa (nome, telefone, senha, email) VALUES (@nome, @telefone, @senha, @email)";
    using var cmdPessoa = new MySqlCommand(sqlPessoa, conn);
    cmdPessoa.Parameters.AddWithValue("@nome", ong.Nome);
    cmdPessoa.Parameters.AddWithValue("@telefone", ong.Telefone);
    cmdPessoa.Parameters.AddWithValue("@senha", ong.Senha);
    cmdPessoa.Parameters.AddWithValue("@email", ong.Email);

    await cmdPessoa.ExecuteNonQueryAsync();

    long idGerado = cmdPessoa.LastInsertedId;

    var sqlOng = "INSERT INTO ONG (idong, rua, numero, bairro, cidade, estado, cep, latitude, longitude, nomeong) VALUES (@idong, @rua, @numero, @bairro, @cidade, @estado, @cep, @latitude, @longitude, @nomedaong)";
    using var cmdOng = new MySqlCommand(sqlOng, conn);
    cmdOng.Parameters.AddWithValue("@idong", idGerado);
    cmdOng.Parameters.AddWithValue("@nomedaong", ong.NomeDaOng);
    cmdOng.Parameters.AddWithValue("@rua", ong.endereco.Rua);
    cmdOng.Parameters.AddWithValue("@numero", ong.endereco.Numero);
    cmdOng.Parameters.AddWithValue("@bairro", ong.endereco.Bairro);
    cmdOng.Parameters.AddWithValue("@cidade", ong.endereco.Cidade);
    cmdOng.Parameters.AddWithValue("@estado", ong.endereco.Estado);
    cmdOng.Parameters.AddWithValue("@cep", ong.endereco.Cep);
    cmdOng.Parameters.AddWithValue("@latitude", ong.Latitude);
    cmdOng.Parameters.AddWithValue("@longitude", ong.Longitude);

    await cmdOng.ExecuteNonQueryAsync();

    return Results.Ok($"Pessoa e ONG cadastrados! ID = {idGerado}");
});

// GET /ong

app.MapGet("/ListarOng", async () =>
{
    var ongs = new List<object>();
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    using var cmd = new MySqlCommand(@"SELECT p.idpessoa AS idpessoa, o.idong AS idong, p.nome AS nome, o.nomeong AS nomedaong, p.telefone AS telefone, p.email AS email, p.senha AS senha,
                                   o.rua AS rua, o.numero AS numero, o.bairro AS bairro, o.cidade AS cidade, o.estado AS estado, o.cep AS cep, o.latitude AS latitude, o.longitude AS longitude
                                   FROM Pessoa p
                                   JOIN ONG o ON p.idpessoa = o.idong;", conn);
    using var reader = await cmd.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        ongs.Add(new
        {
            idpessoa = reader["idpessoa"],
            idong = reader["idong"],
            nomedaong = reader["nomedaong"],
            nome = reader["nome"],
            telefone = reader["telefone"],
            email = reader["email"],
            Senha = reader["senha"],
            endereco = new
            {
                Rua = reader["rua"],
                Numero = reader["numero"],
                Bairro = reader["bairro"],
                Cidade = reader["cidade"],
                Estado = reader["estado"],
                Cep = reader["cep"]
            },
            latitude = reader["latitude"],
            longitude = reader["longitude"]
        });
    }

    return Results.Ok(ongs);
});

// Post /roupa

app.MapPost("/CadastrarRoupa", async (Roupa roupa) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var sqlRoupa = "INSERT INTO Roupas (iddoador, tipo, tamanho, cor, genero, descricao, foto) VALUES (@iddoador, @tipo, @tamanho, @cor, @genero, @descricao, @foto)";
    using var cmdRoupa = new MySqlCommand(sqlRoupa, conn);
    cmdRoupa.Parameters.AddWithValue("@iddoador", roupa.Iddoador);
    cmdRoupa.Parameters.AddWithValue("@tipo", roupa.Tipo);
    cmdRoupa.Parameters.AddWithValue("@tamanho", roupa.Tamanho);
    cmdRoupa.Parameters.AddWithValue("@cor", roupa.Cor);
    cmdRoupa.Parameters.AddWithValue("@genero", roupa.Genero);
    cmdRoupa.Parameters.AddWithValue("@descricao", roupa.Descricao);

    
    byte[] fotoBytes = Convert.FromBase64String(roupa.Foto);

    cmdRoupa.Parameters.AddWithValue("@foto", fotoBytes);

    await cmdRoupa.ExecuteNonQueryAsync();

    long idGerado = cmdRoupa.LastInsertedId;

    return Results.Ok($"Roupa cadastrada! ID = {idGerado}");
});


// GET /roupa

app.MapGet("/ListarRoupa", async () =>
{
    var roupas = new List<object>();
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    using var cmd = new MySqlCommand(@"SELECT p.nome AS nome, r.idroupa AS idroupa, r.iddoador AS iddoador, r.tipo AS tipo, r.tamanho AS tamanho, r.cor AS cor, r.genero AS genero, r.descricao AS descricao, r.foto AS foto
                                   FROM Roupas r, Doador d , Pessoa p WHERE r.iddoador = d.iddoador AND d.iddoador = p.idpessoa;", conn);
    using var reader = await cmd.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        byte[] fotoBytes = (byte[])reader["foto"];
        string fotoBase64 = Convert.ToBase64String(fotoBytes);

        roupas.Add(new
        {
            idroupa = reader["idroupa"],
            iddoador = reader["iddoador"],
            nomedoador = reader["nome"],
            tipo = reader["tipo"],
            tamanho = reader["tamanho"],
            cor = reader["cor"],
            genero = reader["genero"],
            descricao = reader["descricao"],
            foto = fotoBase64
        });
    }

    return Results.Ok(roupas);
});




app.Run();



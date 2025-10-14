using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using MySqlConnector;
using System.Text.Json;

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

// POST /Login
app.MapPost("/Login", async (Login login) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var sql = "SELECT idpessoa, nome, telefone, senha, tipo FROM Pessoa WHERE email = @Email";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Email", login.Email);

    using var reader = await cmd.ExecuteReaderAsync();

    if (!await reader.ReadAsync())
    {
        return Results.Unauthorized(); // email não encontrado
    }

    string senhaHash = reader["senha"].ToString()!;
    string tipo = reader["tipo"].ToString()!;
    string nome = reader["nome"].ToString()!;
    int id = Convert.ToInt32(reader["idpessoa"]);

    // Verifica se a senha digitada confere com o hash do banco
    bool senhaValida = BCrypt.Net.BCrypt.Verify(login.Senha, senhaHash);

    if (!senhaValida)
    {
        return Results.Unauthorized(); // senha incorreta
    }

    return Results.Ok(new
    {
        mensagem = "✅ Login realizado com sucesso!",
        id,
        nome,
        tipo
    });
});

// POST /doador
app.MapPost("/CadastrarDoador", async (Pessoa pessoa) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var sqlPessoa = "INSERT INTO Pessoa (nome, telefone, senha, email, tipo) VALUES (@nome, @telefone, @senha, @email, @tipo)";
    using var cmdPessoa = new MySqlCommand(sqlPessoa, conn);
    cmdPessoa.Parameters.AddWithValue("@nome", pessoa.Nome);
    cmdPessoa.Parameters.AddWithValue("@telefone", pessoa.Telefone);

    string hashSenha = BCrypt.Net.BCrypt.HashPassword(pessoa.Senha);
    cmdPessoa.Parameters.AddWithValue("@senha", hashSenha);

    cmdPessoa.Parameters.AddWithValue("@email", pessoa.Email);
    cmdPessoa.Parameters.AddWithValue("@tipo", pessoa.Tipo);

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

    var sqlPessoa = "INSERT INTO Pessoa (nome, telefone, senha, email, tipo) VALUES (@nome, @telefone, @senha, @email, @tipo)";
    using var cmdPessoa = new MySqlCommand(sqlPessoa, conn);
    cmdPessoa.Parameters.AddWithValue("@nome", pessoa.Nome);
    cmdPessoa.Parameters.AddWithValue("@telefone", pessoa.Telefone);

    string hashSenha = BCrypt.Net.BCrypt.HashPassword(pessoa.Senha);
    cmdPessoa.Parameters.AddWithValue("@senha", hashSenha);

    cmdPessoa.Parameters.AddWithValue("@email", pessoa.Email);
    cmdPessoa.Parameters.AddWithValue("@tipo", pessoa.Tipo);

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

    var sqlPessoa = "INSERT INTO Pessoa (nome, telefone, senha, email, tipo) VALUES (@nome, @telefone, @senha, @email, @tipo)";
    using var cmdPessoa = new MySqlCommand(sqlPessoa, conn);
    cmdPessoa.Parameters.AddWithValue("@nome", ong.Nome);
    cmdPessoa.Parameters.AddWithValue("@telefone", ong.Telefone);

    string hashSenha = BCrypt.Net.BCrypt.HashPassword(ong.Senha);
    cmdPessoa.Parameters.AddWithValue("@senha", hashSenha);

    cmdPessoa.Parameters.AddWithValue("@email", ong.Email);
    cmdPessoa.Parameters.AddWithValue("@tipo", ong.Tipo);

    await cmdPessoa.ExecuteNonQueryAsync();

    long idGerado = cmdPessoa.LastInsertedId;

    var sqlOng = "INSERT INTO ONG (idong, rua, numero, bairro, cidade, estado, latitude, longitude, nomeong) VALUES (@idong, @rua, @numero, @bairro, @cidade, @estado, @latitude, @longitude, @nomedaong)";
    using var cmdOng = new MySqlCommand(sqlOng, conn);
    cmdOng.Parameters.AddWithValue("@idong", idGerado);
    cmdOng.Parameters.AddWithValue("@nomedaong", ong.NomeDaOng);
    cmdOng.Parameters.AddWithValue("@rua", ong.endereco?.Rua ?? "");
    cmdOng.Parameters.AddWithValue("@numero", ong.endereco?.Numero ?? "");
    cmdOng.Parameters.AddWithValue("@bairro", ong.endereco?.Bairro ?? "");
    cmdOng.Parameters.AddWithValue("@cidade", ong.endereco?.Cidade ?? "");
    cmdOng.Parameters.AddWithValue("@estado", ong.endereco?.Estado ?? "");
    cmdOng.Parameters.AddWithValue("@latitude", ong.Latitude);
    cmdOng.Parameters.AddWithValue("@longitude", ong.Longitude);

    await cmdOng.ExecuteNonQueryAsync();

    return Results.Ok($"Pessoa e ONG cadastrados! ID = {idGerado}");
});

// Post /roupa
app.MapPost("/CadastrarRoupa", async (Roupa roupa) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var sqlRoupa = "INSERT INTO Roupas (iddoador, idong, tipo, tamanho, cor, genero, descricao, foto, status) VALUES (@iddoador, @idong, @tipo, @tamanho, @cor, @genero, @descricao, @foto, @status)";
    using var cmdRoupa = new MySqlCommand(sqlRoupa, conn);
    cmdRoupa.Parameters.AddWithValue("@iddoador", roupa.Iddoador);
    cmdRoupa.Parameters.AddWithValue("@idong", roupa.Idong);
    cmdRoupa.Parameters.AddWithValue("@tipo", roupa.Tipo);
    cmdRoupa.Parameters.AddWithValue("@tamanho", roupa.Tamanho);
    cmdRoupa.Parameters.AddWithValue("@cor", roupa.Cor);
    cmdRoupa.Parameters.AddWithValue("@genero", roupa.Genero);
    cmdRoupa.Parameters.AddWithValue("@descricao", roupa.Descricao);
    cmdRoupa.Parameters.AddWithValue("@status", "Pendente"); // Status inicial como "Pendente"


    byte[] fotoBytes = string.IsNullOrEmpty(roupa.Foto) ? Array.Empty<byte>() : Convert.FromBase64String(roupa.Foto);

    cmdRoupa.Parameters.AddWithValue("@foto", fotoBytes);

    await cmdRoupa.ExecuteNonQueryAsync();

    long idGerado = cmdRoupa.LastInsertedId;

    return Results.Ok($"Roupa cadastrada com sucesso!");
});

// GET /ong
app.MapGet("/ListarOng", async () =>
{
    var ongs = new List<object>();
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    using var cmd = new MySqlCommand(@"SELECT p.idpessoa AS idpessoa, o.idong AS idong, p.nome AS nome, o.nomeong AS nomedaong, p.telefone AS telefone, p.email AS email, p.senha AS senha,
                                   o.rua AS rua, o.numero AS numero, o.bairro AS bairro, o.cidade AS cidade, o.estado AS estado, o.latitude AS latitude, o.longitude AS longitude
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
            },
            latitude = reader["latitude"],
            longitude = reader["longitude"]
        });
    }

    return Results.Ok(ongs);
});



// GET /roupa
app.MapGet("/ListarRoupa", async () =>
{
    var roupas = new List<object>();
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    using var cmd = new MySqlCommand(@"SELECT * FROM Roupas;", conn);
    using var reader = await cmd.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        byte[] fotoBytes = (byte[])reader["foto"];
        string fotoBase64 = Convert.ToBase64String(fotoBytes);

        roupas.Add(new
        {
            idroupa = reader["idroupa"],
            iddoador = reader["iddoador"],
            idong = reader["idong"],
            tipo = reader["tipo"],
            tamanho = reader["tamanho"],
            cor = reader["cor"],
            genero = reader["genero"],
            descricao = reader["descricao"],
            status = reader["status"],
            foto = fotoBase64
        });
    }

    return Results.Ok(roupas);
});

app.MapGet("/ListarRoupa/{id}", async (int id) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var cmd = new MySqlCommand(@"
        SELECT r.*, o.nomeong, p.email AS emaildaong, p.telefone AS telefonedaong
        FROM Roupas r
        LEFT JOIN ONG o ON r.idong = o.idong
        LEFT JOIN Pessoa p ON o.idong = p.idpessoa
        WHERE r.idroupa = @id;", conn);
    cmd.Parameters.AddWithValue("@id", id);

    using var reader = await cmd.ExecuteReaderAsync();

    if (!reader.HasRows)
        return Results.NotFound();

    await reader.ReadAsync();

    byte[] fotoBytes = (byte[])reader["foto"];
    string fotoBase64 = Convert.ToBase64String(fotoBytes);

    var roupa = new
    {
        idroupa = reader["idroupa"],
        iddoador = reader["iddoador"],
        idong = reader["idong"],
        tipo = reader["tipo"],
        tamanho = reader["tamanho"],
        cor = reader["cor"],
        genero = reader["genero"],
        descricao = reader["descricao"],
        status = reader["status"],
        foto = fotoBase64,
        nomedaong = reader["nomeong"],
        emaildaong = reader["emaildaong"],
        telefonedaong = reader["telefonedaong"]
    };

    return Results.Ok(roupa);
});

app.MapGet("/ListarPessoa/{id}", async (int id) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var cmd = new MySqlCommand(@"SELECT nome , telefone , email , tipo FROM Pessoa WHERE idpessoa = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);

    using var reader = await cmd.ExecuteReaderAsync();

    if (!reader.HasRows)
        return Results.NotFound();

    await reader.ReadAsync();


    var pessoa = new
    {
        nome = reader["nome"],
        telefone = reader["telefone"],
        email = reader["email"],
        tipo = reader["tipo"]
    };

    return Results.Ok(pessoa);
});

app.MapPost("/AlterarStatus/{id}", async (int id) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var cmd = new MySqlCommand(@"UPDATE Roupas SET status = 'Doado'
                                 WHERE idroupa = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);

    int rowsAffected = await cmd.ExecuteNonQueryAsync();

    if (rowsAffected == 0)
        return Results.NotFound();

    return Results.Ok("Status alterado para 'Doado'.");
});

app.MapPut("/RegistrarRoupa/{id}", async (int id) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var cmd = new MySqlCommand(@"UPDATE Roupas SET status = 'Disponivel'
                                WHERE idroupa = @id ", conn);
    cmd.Parameters.AddWithValue("@id", id);

    int rowsAffected = await cmd.ExecuteNonQueryAsync();

    if (rowsAffected == 0)
        return Results.NotFound();

    return Results.Ok("Roupa alterada para Disponivel!\nAgora todos vão poder ver");
});

app.MapPut("/AlterarRoupa/{id}", async (int id, Roupa roupaatualizada) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var cmd = new MySqlCommand(@"UPDATE Roupas SET tipo = @tipo , cor = @cor , tamanho = @tamanho , descricao = @descricao WHERE idroupa = @id;", conn);
    cmd.Parameters.AddWithValue("@id", id);
    cmd.Parameters.AddWithValue("@tipo", roupaatualizada.Tipo);
    cmd.Parameters.AddWithValue("@cor", roupaatualizada.Cor);
    cmd.Parameters.AddWithValue("@tamanho", roupaatualizada.Tamanho);
    cmd.Parameters.AddWithValue("@descricao", roupaatualizada.Descricao);

    int rowsAffected = await cmd.ExecuteNonQueryAsync();

    if (rowsAffected == 0)
        return Results.NotFound();

    return Results.Ok("Roupa editada com sucesso!");
});

app.MapDelete("/ExcluirRoupa/{id}", async (int id) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var cmd = new MySqlCommand(@"DELETE FROM Roupas WHERE idroupa = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);

    int rowsAffected = await cmd.ExecuteNonQueryAsync();

    if (rowsAffected == 0)
        return Results.NotFound();

    return Results.Ok(true);
});

app.MapPut("/AtualizarEndereco/{id}", async (int id, ONG ong) =>
{
    using var conn = new MySqlConnection(connectionString);
    await conn.OpenAsync();

    var cmd = new MySqlCommand(@"UPDATE ONG SET rua = @rua ,numero = @numero ,bairro = @bairro ,estado = @estado, cidade = @cidade, latitude = @latitude, longitude = @longitude
                                WHERE idong = @id ", conn);
    cmd.Parameters.AddWithValue("@id", id);
    cmd.Parameters.AddWithValue("@rua", ong.endereco.Rua);
    cmd.Parameters.AddWithValue("@numero", ong.endereco.Numero);
    cmd.Parameters.AddWithValue("@bairro", ong.endereco.Bairro);
    cmd.Parameters.AddWithValue("@estado", ong.endereco.Estado);
    cmd.Parameters.AddWithValue("@cidade", ong.endereco.Cidade);
    cmd.Parameters.AddWithValue("@latitude", ong.Latitude);
    cmd.Parameters.AddWithValue("@longitude", ong.Longitude);


    int rowsAffected = await cmd.ExecuteNonQueryAsync();

    if (rowsAffected == 0)
        return Results.NotFound();

    return Results.Ok(true);
});

app.MapPost("/recuperar-senha", async (HttpContext context) =>
{
    using var conn = new MySqlConnection(connectionString);

    var body = await JsonSerializer.DeserializeAsync<Dictionary<string, string>>(context.Request.Body);
    string email = body["email"];

    await conn.OpenAsync();
    var cmd = new MySqlCommand("SELECT idpessoa, nome FROM Pessoa WHERE email = @email", conn);
    cmd.Parameters.AddWithValue("@email", email);

    using var reader = await cmd.ExecuteReaderAsync();
    if (!reader.Read())
        return Results.NotFound();

    int idPessoa = reader.GetInt32("idpessoa");
    string nome = reader.GetString("nome");
    await reader.CloseAsync();

    // Gera token único com validade de 15 minutos
    string token = Guid.NewGuid().ToString();
    var expira = DateTime.UtcNow.AddMinutes(15);

    var update = new MySqlCommand(
        "UPDATE Pessoa SET token_recuperacao=@t, token_expira_em=@e WHERE idpessoa=@id", conn);
    update.Parameters.AddWithValue("@t", token);
    update.Parameters.AddWithValue("@e", expira);
    update.Parameters.AddWithValue("@id", idPessoa);
    await update.ExecuteNonQueryAsync();

    // Monta link para redefinir senha
    string link = $"http://127.0.0.1:5500/src/front/pages/RedefinirSenha.html?token={token}";

    // --- Envia e-mail usando SendGrid ---
    try
    {
        await EmailService.EnviarAsync(
            email,
            "Redefinição de senha - DoaAqui",
            $@"
            <h2>Olá, {nome}!</h2>
            <p>Você solicitou a redefinição da sua senha.</p>
            <p>Clique no link abaixo para criar uma nova senha (válido por 15 minutos):</p>
            <p><a href='{link}' target='_blank'>{link}</a></p>
            <br>
            <p>Se você não fez essa solicitação, ignore este e-mail.</p>"
        );
    }
    catch (Exception ex)
    {
        Console.WriteLine("Falha ao enviar e-mail de recuperação: " + ex.Message);
        return Results.Problem("Erro ao enviar e-mail.", statusCode: 500);
    }

    return Results.Ok(new { mensagem = "Link de redefinição gerado e enviado por e-mail." });
});



app.MapPost("/redefinir-senha", async (HttpContext context) =>
{   
     using var conn = new MySqlConnection(connectionString);

    var body = await JsonSerializer.DeserializeAsync<Dictionary<string, string>>(context.Request.Body);
    string token = body["token"];
    string novaSenha = body["senha"];

    await conn.OpenAsync();
    var cmd = new MySqlCommand(
        "SELECT idpessoa, token_expira_em FROM Pessoa WHERE token_recuperacao = @t", conn);
    cmd.Parameters.AddWithValue("@t", token);

    using var reader = await cmd.ExecuteReaderAsync();
    if (!reader.Read()) return Results.BadRequest("Token inválido");

    DateTime expira = reader.GetDateTime("token_expira_em");
    if (DateTime.UtcNow > expira)
        return Results.BadRequest("Token expirado");

    int id = reader.GetInt32("idpessoa");
    await reader.CloseAsync();

    // Criptografa a nova senha
    string hash = BCrypt.Net.BCrypt.HashPassword(novaSenha);

    var update = new MySqlCommand(
        "UPDATE Pessoa SET senha=@s, token_recuperacao=NULL, token_expira_em=NULL WHERE idpessoa=@id", conn);
    update.Parameters.AddWithValue("@s", hash);
    update.Parameters.AddWithValue("@id", id);
    await update.ExecuteNonQueryAsync();

    return Results.Ok();
});



app.Run();
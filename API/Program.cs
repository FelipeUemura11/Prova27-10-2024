using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();
app.MapControllers();


app.MapGet("/", () => "Prova A1");

//ENDPOINTS DE CATEGORIA
//GET: http://localhost:5273/api/categoria/listar
app.MapGet("/api/categoria/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Categorias.Any())
    {
        return Results.Ok(ctx.Categorias.ToList());
    }
    return Results.NotFound("Nenhuma categoria encontrada");
});

//POST: http://localhost:5273/api/categoria/cadastrar
app.MapPost("/api/categoria/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Categoria categoria) =>
{
    ctx.Categorias.Add(categoria);
    ctx.SaveChanges();
    return Results.Created("", categoria);
});

//ENDPOINTS DE TAREFA
//GET: http://localhost:5273/api/tarefas/listar
app.MapGet("/api/tarefas/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Tarefas.Any())
    {
        return Results.Ok(ctx.Tarefas.Include(x => x.Categoria).ToList());
    }
    return Results.NotFound("Nenhuma tarefa encontrada");
});

//POST: http://localhost:5273/api/tarefas/cadastrar
app.MapPost("/api/tarefas/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Tarefa tarefa) =>
{
    Categoria? categoria = ctx.Categorias.Find(tarefa.CategoriaId);
    if (categoria == null)
    {
        return Results.NotFound("Categoria não encontrada");
    }
    tarefa.Categoria = categoria;
    ctx.Tarefas.Add(tarefa);
    ctx.SaveChanges();
    return Results.Created($"/api/tarefas/cadastrar/{tarefa.Id}", tarefa);
});

//PUT: http://localhost:5273/tarefas/alterar/{id}
app.MapPut("/api/tarefas/alterar/{id}", async ([FromServices] AppDataContext ctx, [FromRoute] int id, [FromBody] Tarefa tarefa_atualizada) =>
{

    var tarefa_existente = await ctx.Tarefas.FindAsync(id);

    if (tarefa_existente == null)
    {
        return Results.NotFound($"Tarefa com ID {id} não encontrada.");
    }

    tarefa_existente.Titulo = tarefa_atualizada.Titulo;
    tarefa_existente.Descricao = tarefa_atualizada.Descricao;
    tarefa_existente.CategoriaId = tarefa_atualizada.CategoriaId;
    tarefa_existente.Status = tarefa_atualizada.Status;

    await ctx.SaveChangesAsync();

    return Results.Ok("Cliente atualizado com sucesso.");   
});

//GET: http://localhost:5273/tarefas/naoconcluidas
app.MapGet("/api/tarefas/naoconcluidas", ([FromServices] AppDataContext ctx) =>
{   
    Tarefa? tarefas = ctx.Tarefas.Include(x => x.Status).FirstOrDefault(t => t.Status == "Não iniciada");
    if(tarefas is null){
        return Results.NotFound("Todas as tarefas estao concluidas ou pendentes!");
    }
    return Results.Ok(tarefas);
});

//GET: http://localhost:5273/tarefas/concluidas
app.MapGet("/api/tarefas/concluidas", ([FromServices] AppDataContext ctx) =>
{
    Tarefa? tarefas = ctx.Tarefas.Include(x => x.Status).FirstOrDefault(t => t.Status == "Concluido");
    if(tarefas is null){
        return Results.NotFound("Todas as tarefas estao concluidas ou pendentes!");
    }
    return Results.Ok(tarefas);
});

app.Run();

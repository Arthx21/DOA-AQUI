# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app
COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./
EXPOSE 5000
ENTRYPOINT ["dotnet", "Programa.dll"]


COPY src/back/Programa/ca.pem /app/ca.pem

ENV CONNECTION_STRING="Server=mysql-e51083d-doaaqui.k.aivencloud.com;Port=26584;Database=doaaquiDB;User ID=avnadmin;Password=AVNS_nIqBD4P6y_dcBlXxHZO;SslMode=Required;SslCa=/app/ca.pem;"
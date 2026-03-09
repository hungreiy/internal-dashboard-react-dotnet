# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution + project files
COPY backend/*.csproj backend/
COPY backend/*.sln backend/
RUN dotnet restore backend/backend.csproj

# Copy full backend code
COPY backend/ backend/
RUN dotnet publish backend/backend.csproj -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "backend.dll"]
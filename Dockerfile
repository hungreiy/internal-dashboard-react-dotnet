# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only project file first (better caching)
COPY backend/backend.csproj backend/
RUN dotnet restore backend/backend.csproj

# Copy everything else
COPY . .
RUN dotnet publish backend/backend.csproj -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "backend.dll"]
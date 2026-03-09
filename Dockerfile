# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and sln first for caching
COPY backend/*.csproj backend/
COPY backend/*.sln backend/
RUN dotnet restore backend/backend.csproj

# Copy rest of the backend
COPY backend/ backend/
RUN dotnet publish backend/backend.csproj -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENTRYPOINT ["dotnet", "backend.dll"]
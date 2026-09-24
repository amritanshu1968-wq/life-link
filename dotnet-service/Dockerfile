FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["VerificationService.csproj", "./"]
RUN dotnet restore "VerificationService.csproj"

COPY . .
RUN dotnet build "VerificationService.csproj" -c Release -o /app/build
RUN dotnet publish "VerificationService.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5001
EXPOSE 5001

ENTRYPOINT ["dotnet", "VerificationService.dll"]

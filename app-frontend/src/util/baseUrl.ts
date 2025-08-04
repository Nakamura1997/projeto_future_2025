export const getBaseUrl = (): string => {
  // Em produção no Docker, usa o nome do serviço do backend
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_API_URL || "http://35.239.165.7:8000"; // "backend" é o nome do serviço no docker-compose
  }

  // Em desenvolvimento local, usa localhost
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

# Usar a imagem oficial do Python
FROM python:3.11-slim

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Instalar system dependencies for weasyprint
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libgirepository1.0-dev \
    gir1.2-gtk-3.0 \
    libglib2.0-dev \
    libpango1.0-dev \
    libffi-dev \
    libharfbuzz-dev \
    libfreetype6-dev \
    python3-dev \
    build-essential \
    pkg-config \
 && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos de requisitos
COPY ./requirements.txt /app/requirements.txt

# Instala os navegadores necessários para o Playwright funcionar
RUN playwright install --with-deps

# Instalar dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Instala pandoc e dependências (deixe antes do COPY e pip install para cache eficiente)
RUN apt-get update && \
    apt-get install -y pandoc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copiar o código do backend para dentro do container
COPY ./ /app

# Expor a porta padrão do Django
EXPOSE 8000

# Comando para rodar a aplicação
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
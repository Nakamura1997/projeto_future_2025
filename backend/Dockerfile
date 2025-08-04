# Usar imagem oficial do Python com base slim
FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema (para weasyprint e playwright)
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
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependências do Python
COPY ./requirements.txt /app/requirements.txt

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Instalar navegadores do Playwright
RUN python -m playwright install --with-deps

# Copiar restante da aplicação
COPY ./ /app

# Expor a porta da aplicação
EXPOSE 8000

# Comando para rodar a aplicação
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]

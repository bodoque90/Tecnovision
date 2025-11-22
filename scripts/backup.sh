#!/bin/sh

echo "Iniciando sistema de backups..."

# Bucle infinito
while true; do
    # 1. Generar nombre de archivo con la fecha actual (ej: backup_2025-11-22_15-30.sql)
    FILENAME="/backups/backup_$(date +%Y-%m-%d_%H-%M-%S).sql"
    
    echo "Realizando backup: $FILENAME"
    
    # 2. Ejecutar comando de dump usando las variables de entorno
    # PGPASSWORD es necesario para que no pida contraseña manual
    PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h db -U $POSTGRES_USER -d $POSTGRES_DB > $FILENAME
    
    if [ $? -eq 0 ]; then
        echo "Backup exitoso."
    else
        echo "Error al crear el backup."
    fi

    # 3. Esperar X segundos antes del siguiente (ej: 60 segundos para pruebas)
    # En producción pondrías 86400 para hacerlo diario.
    echo "Esperando 60 segundos..."
    sleep 60
done
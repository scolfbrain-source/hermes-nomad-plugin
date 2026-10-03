# hermes-nomad-plugin

Plugin de escritorio Hermes: acceso a Project NOMAD (Command Center en sbrain :8086)
desde el sidebar del Hermes Desktop, con el Command Center embebido y escape a navegador.

## Instalación (por máquina)

Hermes Desktop → ⌘K → Capabilities → pestaña Plugins → **Install from Git** →
URL: `https://github.com/scolfbrain-source/hermes-nomad-plugin` → destino **Desktop** activado.

Tras instalar: la fila "NOMAD" aparece en el sidebar izquierdo.

## Requisitos

- NOMAD corriendo en sbrain: `http://192.168.1.142:8086` (ver skill nomad-ops)
- La URL del Command Center está al inicio del plugin.js (constante BASE)

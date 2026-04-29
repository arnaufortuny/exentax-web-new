/**
 * Pure data definition of the Exentax Discord bot's global slash-command
 * manifest. Extracted from `discord-bot.ts` so any caller — the bot
 * itself, the standalone `register-discord-commands.ts` script, the
 * regression gate that validates the manifest in CI — can build and
 * inspect the manifest without dragging in the bot's runtime imports
 * (storage, db, handlers, …) that would otherwise require `DATABASE_URL`
 * and other env at module-load time.
 *
 * Keep this file dependency-free: it must remain importable from any
 * environment, including a fresh CI shell with no Discord secrets and
 * no database. Anything beyond plain object literals belongs elsewhere.
 *
 * The structural rules Discord enforces on this manifest (name length,
 * unique subcommand names per parent, valid option types, …) are
 * checked by `validateSlashCommandManifest()` in
 * `scripts/discord/register-discord-commands.ts`.
 */
export function buildSlashCommandManifest() {
  const dateOption = { name: "fecha", description: "Fecha (YYYY-MM-DD)", type: 3, required: true };
  const timeOption = { name: "hora", description: "Hora (HH:MM, slot de 30min)", type: 3, required: true };
  return [
    {
      name: "ayuda",
      description: "Lista todos los comandos del bot de agenda Exentax",
    },
    {
      name: "agenda",
      description: "Consulta y gestión de la agenda de Exentax",
      options: [
        { type: 1, name: "hoy",    description: "Reservas de hoy" },
        { type: 1, name: "semana", description: "Reservas de los próximos 7 días" },
        {
          type: 1, name: "buscar", description: "Buscar reservas por ID, nombre o email",
          options: [{ name: "q", description: "Booking ID, nombre o email", type: 3, required: true }],
        },
        {
          type: 1, name: "libre", description: "Slots libres en un día",
          options: [{ name: "fecha", description: "Fecha (YYYY-MM-DD)", type: 3, required: true }],
        },
        {
          type: 1, name: "bloquear", description: "Bloquear un día",
          options: [
            { name: "fecha", description: "Fecha (YYYY-MM-DD)", type: 3, required: true },
            { name: "motivo", description: "Motivo (opcional)", type: 3, required: false },
          ],
        },
        {
          type: 1, name: "desbloquear", description: "Desbloquear un día",
          options: [{ name: "fecha", description: "Fecha (YYYY-MM-DD)", type: 3, required: true }],
        },
      ],
    },
    {
      name: "cita",
      description: "Acciones sobre una cita concreta",
      options: [
        {
          type: 1, name: "ver", description: "Ver detalle de una cita",
          options: [{ name: "id", description: "Booking ID", type: 3, required: true }],
        },
        {
          type: 1, name: "confirmar", description: "Confirmar una cita pendiente",
          options: [{ name: "id", description: "Booking ID", type: 3, required: true }],
        },
        {
          type: 1, name: "cancelar", description: "Cancelar una cita",
          options: [{ name: "id", description: "Booking ID", type: 3, required: true }],
        },
        {
          type: 1, name: "noshow", description: "Marcar como no-show",
          options: [{ name: "id", description: "Booking ID", type: 3, required: true }],
        },
        {
          type: 1, name: "reprogramar", description: "Reprogramar a nueva fecha y hora",
          options: [
            { name: "id", description: "Booking ID", type: 3, required: true },
            dateOption,
            timeOption,
          ],
        },
        {
          type: 1, name: "email", description: "Enviar email manual al cliente",
          options: [
            { name: "id", description: "Booking ID", type: 3, required: true },
            {
              name: "tipo", description: "Tipo de email", type: 3, required: true,
              choices: [
                { name: "confirmación",       value: "confirmation" },
                { name: "recordatorio",       value: "recordatorio" },
                { name: "no-show / reagenda", value: "noshow" },
                { name: "seguimiento",        value: "seguimiento" },
              ],
            },
          ],
        },
        {
          type: 1, name: "nueva", description: "Crear una cita manualmente",
          options: [
            { name: "nombre", description: "Nombre del cliente", type: 3, required: true },
            { name: "email",  description: "Email del cliente",  type: 3, required: true },
            dateOption,
            timeOption,
            { name: "telefono", description: "Teléfono (opcional)", type: 3, required: false },
            { name: "notas",    description: "Notas internas",      type: 3, required: false },
            {
              name: "idioma", description: "Idioma del cliente (por defecto: es)",
              type: 3, required: false,
              choices: [
                { name: "Español",    value: "es" },
                { name: "English",    value: "en" },
                { name: "Français",   value: "fr" },
                { name: "Deutsch",    value: "de" },
                { name: "Português",  value: "pt" },
                { name: "Català",     value: "ca" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "newsletter",
      description: "Broadcast newsletter a suscriptores Exentax",
      options: [
        {
          type: 1, name: "enviar",
          description: "Enviar campaña a suscriptores activos (filtrable por idioma)",
          options: [
            { name: "asunto", description: "Subject del email (max 100 chars)", type: 3, required: true },
            { name: "html",   description: "URL HTTPS al HTML del email (incluir {{unsubscribe_url}})", type: 3, required: true },
            {
              name: "idioma", description: "Filtro idioma (por defecto: todos)",
              type: 3, required: false,
              choices: [
                { name: "Todos",     value: "all" },
                { name: "Español",   value: "es" },
                { name: "English",   value: "en" },
                { name: "Français",  value: "fr" },
                { name: "Deutsch",   value: "de" },
                { name: "Português", value: "pt" },
                { name: "Català",    value: "ca" },
              ],
            },
          ],
        },
        {
          type: 1, name: "status", description: "Estado de una campaña",
          options: [{ name: "id", description: "Campaign ID (CMP_…)", type: 3, required: true }],
        },
        {
          type: 1, name: "cancelar", description: "Cancelar una campaña en curso",
          options: [{ name: "id", description: "Campaign ID (CMP_…)", type: 3, required: true }],
        },
      ],
    },
  ];
}

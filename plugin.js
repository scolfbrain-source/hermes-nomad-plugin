/**
 * NOMAD — acceso a Project NOMAD (Command Center) desde Hermes Desktop.
 * Fila en el sidebar izquierdo + página /nomad con el Command Center embebido
 * (SandboxedFrame) y escape a navegador externo. Escape necesario porque NOMAD
 * manda X-Frame-Options: DENY; si el frame guest lo bloquea, onError lo muestra.
 */
import { cn, haptic, host, StatusDot, Button, usePluginI18n, ROUTES_AREA, SIDEBAR_NAV_AREA, PALETTE_AREA } from '@hermes/plugin-sdk'
import { jsx, jsxs } from 'react/jsx-runtime'
import { useState, useEffect, useCallback } from 'react'

const ID = 'nomad'
const BASE = 'http://192.168.1.142:8086'

let pluginCtx = null

function useOnline() {
  const [status, setStatus] = useState('checking')
  const check = useCallback(() => {
    setStatus('checking')
    const img = new Image()
    const timer = setTimeout(() => { img.src = ''; setStatus('offline') }, 4000)
    img.onload = () => { clearTimeout(timer); setStatus('online') }
    img.onerror = () => { clearTimeout(timer); setStatus('offline') }
    img.src = `${BASE}/favicon-32x32.png?_=${Date.now()}`
  }, [])
  useEffect(() => { check() }, [check])
  return [status, check]
}

function NomadPage() {
  const t = usePluginI18n(ID)
  const [status, check] = useOnline()
  const [frameFailed, setFrameFailed] = useState(false)
  const [showFrame, setShowFrame] = useState(false)
  const [frameKey, setFrameKey] = useState(0)

  const openExternal = () => {
    haptic('tap')
    if (pluginCtx) pluginCtx.os.openExternal(BASE)
  }

  const reload = () => {
    haptic('tap')
    setFrameFailed(false)
    setFrameKey(k => k + 1)
    check()
  }

  return jsxs('div', {
    className: 'flex h-full flex-col',
    children: [
      jsxs('div', {
        className: 'flex items-center gap-2 border-b border-(--ui-stroke-secondary) px-3 py-2',
        children: [
          jsx(StatusDot, {
            tone: status === 'online' ? 'good' : status === 'checking' ? 'muted' : 'bad',
            title: t('status', status)
          }),
          jsx('span', { className: 'text-sm font-medium', children: 'Project NOMAD' }),
          jsx('span', { className: 'text-xs text-(--ui-text-tertiary)', children: '192.168.1.142:8086' }),
          jsx('div', { className: 'flex-1' }),
          jsx(Button, {
            variant: 'ghost',
            size: 'sm',
            onClick: reload,
            children: t('refresh')
          }),
          jsx(Button, { variant: 'outline', size: 'sm', onClick: openExternal, children: t('openBrowser') })
        ]
      }),
      jsxs('div', {
        className: 'flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center',
        children: [
          jsx('div', {
            className: 'text-sm text-(--ui-text-secondary)',
            children: status === 'offline' ? t('offline') : t('embedNote')
          }),
          jsx('div', { className: 'text-xs text-(--ui-text-tertiary)', children: BASE }),
          jsxs('div', { className: 'flex gap-2', children: [
            jsx(Button, { variant: 'default', size: 'sm', onClick: openExternal, children: t('openNomad') }),
            jsx(Button, { variant: 'outline', size: 'sm', onClick: () => { setFrameFailed(false); check() }, children: t('retry') }),
            jsx(Button, { variant: 'ghost', size: 'sm', onClick: () => setShowFrame(v => !v), children: showFrame ? t('hideEmbed') : t('showEmbed') })
          ]})
        ]
      }),
      showFrame && jsx('iframe', {
        key: frameKey,
        src: BASE,
        title: 'Project NOMAD Command Center',
        className: 'min-h-0 flex-[3] w-full border-t border-(--ui-border) bg-white',
        onError: () => setFrameFailed(true)
      })
    ]
  })
}

export default {
  id: ID,
  name: 'NOMAD',
  register(ctx) {
    pluginCtx = ctx

    ctx.i18n.register({
      es: {
        status: s => s === 'online' ? 'NOMAD conectado' : s === 'checking' ? 'Comprobando NOMAD…' : 'NOMAD sin conexión',
        openNomad: 'Abrir NOMAD', hideEmbed: 'Ocultar embebido', showEmbed: 'Vista embebida', embedNote: 'El Command Center se abre en tu navegador (la vista embebida queda limitada por la seguridad del sandbox).', openBrowser: 'Abrir en navegador',
        refresh: 'Recargar',
        offline: 'NOMAD no responde en sbrain.',
        embedBlocked: 'NOMAD bloquea el embebido (X-Frame-Options). Ábrelo en el navegador.',
        retry: 'Reintentar'
      },
      en: {
        status: s => s === 'online' ? 'NOMAD online' : s === 'checking' ? 'Checking NOMAD…' : 'NOMAD offline',
        openNomad: 'Abrir NOMAD', hideEmbed: 'Ocultar embebido', showEmbed: 'Vista embebida', embedNote: 'El Command Center se abre en tu navegador (la vista embebida queda limitada por la seguridad del sandbox).', openBrowser: 'Open in browser',
        refresh: 'Reload',
        offline: 'NOMAD is not responding on sbrain.',
        embedBlocked: 'NOMAD blocks embedding (X-Frame-Options). Open it in your browser.',
        retry: 'Retry'
      }
    })

    ctx.registerMany([
      {
        id: 'page',
        area: ROUTES_AREA,
        data: { path: '/nomad' },
        render: () => jsx(NomadPage, {})
      },
      {
        id: 'nav',
        area: SIDEBAR_NAV_AREA,
        data: { path: '/nomad', label: 'NOMAD', codicon: 'globe' }
      },
      {
        id: 'open-page',
        area: PALETTE_AREA,
        data: {
          id: 'nomad.open',
          label: 'Abrir NOMAD',
          keywords: ['nomad', 'wikipedia', 'offline', 'mapas'],
          run: () => host.navigate('/nomad')
        }
      },
      {
        id: 'open-browser',
        area: PALETTE_AREA,
        data: {
          id: 'nomad.open-external',
          label: 'Abrir NOMAD en navegador',
          keywords: ['nomad', 'browser', 'navegador'],
          run: () => ctx.os.openExternal(BASE)
        }
      }
    ])
  }
}

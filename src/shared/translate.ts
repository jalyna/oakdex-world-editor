interface TranslationMap {
  [key: string]: {
    [key: string]: string
  }
}

const TRANSLATIONS = {
  de: {
    invalid_format: 'Ungültiges Dateiformat',
    accepted_formats: 'Akzeptierte Formate: .png, .tileset.json, .map.json',
    intro: 'Das erste mal hier? Einfach ein Tileset, das ein PNG ist, hinzufügen und tolle Maps erstellen.',
    close: 'Schließen',
    new_map: 'Neue Map',
    download: 'Download',
    add_objects: 'Hinzufügen',
    remove_objects: 'Entfernen',
    objects_info: 'Objekte sind im Vordergrund sichtbar, der Spieler verschwindet dahinter. Für Dächer, Baumkronen etc.',
    objects: 'Objekte',
    walk: 'Laufbarkeit',
    auto: 'Auto',
    special: 'Spezial',
    walk_simple: 'Einfach',
    walk_details: 'Alle 4 Richtungen',
    legend: 'Legende',
    walkable: 'Passierbar',
    blocked: 'Nicht passierbar',
    overridable: 'Immer passierbar, wenn im Vordergrund (z.B. Brücken)',
    autotile_description: 'Auto Tiles sollten für Berggruppen, Flüsse, Wege genutzt werden.',
    add: 'Hinzufügen',
    remove: 'Löschen',
    special_description: 'Spezial-Tiles kannst du nach belieben konfigurieren. Zum Beispiel könntest du Wasser markieren, damit du später darauf surfen kannst.'
  },

  en: {
    invalid_format: 'Invalid Format',
    accepted_formats: 'Accepted Formats: .png, .tileset.json, .map.json',
    intro: 'Your first time here? Just add a Tileset that is a PNG and start creating awesome Maps.',
    close: 'Close',
    new_map: 'New Map',
    download: 'Download',
    add_objects: 'Add objects',
    remove_objects: 'Remove objects',
    objects_info: 'Objects will be placed in the foreground like trees, so the player walks in front of them.',
    objects: 'Objects',
    walk: 'Walk',
    auto: 'Auto',
    special: 'Special',
    walk_simple: 'Simple',
    walk_details: 'Details',
    legend: 'Legend',
    walkable: 'Walkable',
    blocked: 'Not walkable',
    overridable: 'Always walkable, when on top layer (e.g. bridges)',
    autotile_description: 'Auto Tiles should be used for mountain groups, water, pavement. Anything that has borders.',
    add: 'Add',
    remove: 'Remove',
    special_description: 'Special Tiles can be used for whatever you want. It makes for example sense to mark water if you later want to surf in it.'
  }
} as TranslationMap

function getLocale (): string {
  const userLang = (navigator.language || 'en').split('-')[0]
  if (TRANSLATIONS[userLang]) {
    return userLang
  } else {
    return 'en'
  }
}

export default function (key: string): string {
  return TRANSLATIONS[getLocale()][key] || key
}

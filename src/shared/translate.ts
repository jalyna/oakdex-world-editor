interface TranslationMap {
  [key: string]: {
    [key: string]: string
  }
}

const TRANSLATIONS = {
  de: {
    create_new_map_tilesets: 'Neue Map',
    invalid_format: 'Ungültiges Dateiformat',
    accepted_formats: 'Akzeptierte Formate: .png, .tileset.json, .map.json',
    intro: 'Du willst selber ein Tileset erstellen? Einfach ein PNG hochladen.',
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
    special_description: 'Spezial-Tiles kannst du nach belieben konfigurieren. Zum Beispiel könntest du Wasser markieren, damit du später darauf surfen kannst.',
    export_as_png: 'Download PNG',
    brush_tool: 'Stempel',
    fill_tool: 'Füllwerkzeug',
    auto_tool: 'Auto-Tiles',
    erase_tool: 'Löschwerkzeug',
    random_tool: 'Zufallstool',
    new_layer: 'Neue Ebene',
    upload_another_tileset: 'Weiteres Tileset hochladen',
    upload_tileset_text: 'Lade ein *.tileset.json hoch',
    remove_tileset: 'Tileset entfernen',
    upload_new_tileset_image: 'Neues Bild für Tileset',
    upload_tileset_image_text: 'Lade ein .png hoch',
    tileset_too_small: 'Die Abmessungen des Bildes sind kleiner als das Original',
    credit_title_placeholder: 'Credit Name',
    credits_description: 'Trage hier ein wer an dieses Tileset erstellt hast, damit du sie nennst.',
    credit_url_placeholder: 'URL (optional)',
    credits: 'Credits',
    save_for_game: 'Download GameMap',
    play_demo: 'Demo'
  },

  en: {
    create_new_map_tilesets: 'New Map',
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
    special_description: 'Special Tiles can be used for whatever you want. It makes for example sense to mark water if you later want to surf in it.',
    export_as_png: 'Export as PNG',
    brush_tool: 'Brush',
    fill_tool: 'Fill tool',
    auto_tool: 'Auto Tiles',
    erase_tool: 'Eraser',
    random_tool: 'Random tool',
    new_layer: 'New Layer',
    upload_another_tileset: 'Upload another Tileset',
    upload_tileset_text: 'Upload *.tileset.json',
    remove_tileset: 'Remove Tileset',
    upload_new_tileset_image: 'Upload new tileset image',
    upload_tileset_image_text: 'Upload a .png file',
    tileset_too_small: 'The image dimensions are smaller than the original',
    credit_title_placeholder: 'Credit Name',
    credits_description: 'Add here who should get credit for the tileset.',
    credit_url_placeholder: 'URL (optional)',
    credits: 'Credits',
    save_for_game: 'Download for Game',
    play_demo: 'Demo'
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

export function processMitreMappings(data) {
  const mappings = {}
  let currentCategory = ''

  if (!Array.isArray(data)) {
    return []
  }

  data.forEach((item) => {
    if (item['Telemetry Feature Category']) {
      currentCategory = item['Telemetry Feature Category']
      mappings[currentCategory] = {
        name: currentCategory,
        techniques: [],
        description: `Techniques related to ${currentCategory.toLowerCase()}`,
      }
    }
    if (currentCategory && item['Sub-Category']) {
      mappings[currentCategory].techniques.push({
        name: item['Sub-Category'],
        mapping: item['MITRE ATT&CK Mappings'],
      })
    }
  })

  return Object.values(mappings)
}

export async function fetchMitreMappings() {
  const response = await fetch(
    'https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/mitre_att%26ck_mappings.json'
  )
  if (!response.ok) {
    throw new Error(`Failed to fetch mappings (${response.status})`)
  }
  const data = await response.json()
  return processMitreMappings(data)
}

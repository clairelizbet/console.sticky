import { Styles } from '../types/styles.mjs'
import { convertCamelCaseToKebabCase } from '../util/string.mjs'

function transformStyles(cssRules: Styles): string {
  let styles: string = ''

  for (const ruleName in cssRules) {
    styles = styles.concat(
      `${convertCamelCaseToKebabCase(ruleName)}:${cssRules[ruleName]};`
    )
  }

  return styles
}

export function formatSticky(message: string, ...styles: Styles[]): unknown[] {
  const convertedStyles = styles.map(transformStyles)
  return [message, ...convertedStyles]
}

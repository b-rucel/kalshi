import { color } from "./colors";

/**
 * Syntax highlights a JSON object for terminal output
 */
export function highlightJson(data: any, indent: number = 2): string {
    const json = JSON.stringify(data, null, indent);

    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = "white"; // Default

        // Key
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                // It's a key
                // Remove the colon for coloring, then add it back (uncolored or different color)
                const key = match.slice(0, -1);
                return color(key, "#FF81D0") + ":";
            } else {
                // String value
                return color(match, "#0CF25D");
            }
        }
        // Boolean
        else if (/true|false/.test(match)) {
            return color(match, "magenta");
        }
        // Null
        else if (/null/.test(match)) {
            return color(match, "coral");
        }
        // Number
        else {
            return color(match, "yellow");
        }
    });
}

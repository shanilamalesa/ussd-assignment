function clamp(text, max = 180) {
    if (text.length <= max) return text;
    return text.slice(0, max - 3) + "...";
}

module.exports = clamp;
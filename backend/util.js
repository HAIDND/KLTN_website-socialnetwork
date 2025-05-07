function removeVietnameseTones(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .trim();
  }

function generateFlexibleRegex(input) {
    const words = removeVietnameseTones(input).split(/\s+/);
    return words.map(w => `(?=.*${w})`).join("") + ".*"; // kiểu lookahead
  }

module.exports = {
  removeVietnameseTones,
  generateFlexibleRegex
};

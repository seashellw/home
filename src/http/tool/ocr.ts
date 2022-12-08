declare global {
  interface Window {
    Tesseract: any;
  }
}

export const Language = {
  CHINESE_SIMPLIFIED: "chi_sim",
  ENGLISH: "eng",
};

export const start = async (option: { lang: string; url: string }) => {
  let { data } = await window.Tesseract.recognize(option.url, option.lang);
  console.log("data", data);
};

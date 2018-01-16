import validator from "validator";

export default {
  isUrl(url) {
    if (!url) {
      return false;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return false;
    }

    return validator.isURL(url, ["http", "https"]);
  }
}

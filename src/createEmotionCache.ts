import { EmotionCache } from "@emotion/react";
import createCache from "@emotion/cache";

export default function createEmotionCache(): EmotionCache {
  return createCache({ key: "css", prepend: true });
}

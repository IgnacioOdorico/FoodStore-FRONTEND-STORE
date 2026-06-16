export const transformCloudinaryUrl = (url: string, w = 600, h = 600) => {
  if (!url?.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_fill,w_${w},h_${h}/`);
};

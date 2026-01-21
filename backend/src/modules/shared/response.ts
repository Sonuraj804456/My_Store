export const success = (data: any) => ({
  success: true,
  data,
  error: null
});

export const failure = (error: any) => ({
  success: false,
  data: null,
  error
});

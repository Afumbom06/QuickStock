declare module 'figma:asset/*' {
  const content: string;
  export default content;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

// Allow importing packages with no type declarations
declare module 'sonner';

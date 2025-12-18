import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // Package aliases
      'vaul@1.1.2': 'vaul',
      'sonner@2.0.3': 'sonner',
      'recharts@2.15.2': 'recharts',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      'react-hook-form@7.55.0': 'react-hook-form',
      'react-day-picker@8.10.1': 'react-day-picker',
      'next-themes@0.4.6': 'next-themes',
      'lucide-react@0.487.0': 'lucide-react',
      'input-otp@1.4.2': 'input-otp',
      'embla-carousel-react@8.6.0': 'embla-carousel-react',
      'cmdk@1.1.1': 'cmdk',
      'class-variance-authority@0.7.1': 'class-variance-authority',
      '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
      '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
      '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
      '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
      '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
      '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
      '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
      '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
      '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
      '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
      '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
      '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
      '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
      '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
      '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
      '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
      '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
      '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
      '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
      '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
      '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
      '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
      '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
      
      // Figma asset aliases - Map figma:asset imports to actual files
      'figma:asset/ad64750a24ee1f916279c7ed992d0faf79f9620b.png': path.resolve(__dirname, './src/assets/ad64750a24ee1f916279c7ed992d0faf79f9620b.png'),
      'figma:asset/3e8773a26a1c5d7aba8ce2793d7cca62bf591f3d.png': path.resolve(__dirname, './src/assets/3e8773a26a1c5d7aba8ce2793d7cca62bf591f3d.png'),
      'figma:asset/815b5738a398eb37b405fa2eb742e21129a3c7da.png': path.resolve(__dirname, './src/assets/815b5738a398eb37b405fa2eb742e21129a3c7da.png'),
      'figma:asset/4eaa28092d1900da18dff5b5acdce29e60ca64ed.png': path.resolve(__dirname, './src/assets/4eaa28092d1900da18dff5b5acdce29e60ca64ed.png'),
      'figma:asset/663e557c1d4550cf906ea0a21e5f45388847c7fb.png': path.resolve(__dirname, './src/assets/663e557c1d4550cf906ea0a21e5f45388847c7fb.png'),
      'figma:asset/6dccce9292d3f0db3e8fabffece2329841378d23.png': path.resolve(__dirname, './src/assets/6dccce9292d3f0db3e8fabffece2329841378d23.png'),
      'figma:asset/fabf5b77515cd8a456d8c0e44608a2495763767c.png': path.resolve(__dirname, './src/assets/fabf5b77515cd8a456d8c0e44608a2495763767c.png'),
      
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});
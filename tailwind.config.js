/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "task-primary":"#6A51FF",
        "task-blue": "#007AFF",
        "task-bg-blue": " rgba(0, 122, 255, 1)",
        "task-gray": "#E9E9E9",
        "task-red": "#E7492E",
        "task-orange": "#004E71",
        "task-green": "#33AA44",
        "task-black": "#212121",
        "task-black-label": "rgba(33, 33, 33, 1)",
        "task-welcom-black": "rgba(0, 0, 0, 1)",
        "bg-gray-login":"rgba(217, 217, 217, 1)",
        "bg-white-login":"rgba(251, 251, 253, 0.5)",
        "bg-input-color":"rgba(216, 216, 216, 1)",
        "task-icon-bg":" rgba(0, 122, 255, 0.1)",
        "task-icon-text":"rgba(41, 45, 50, 1)",
        "categorie-icon-text":"rgba(41, 45, 50, 0.5)",
        "task-home-bg" : "rgba(248, 248, 248, 1)",
        "task-input-placeholder" : "rgba(216, 216, 216, 0.87)",
        "task-tag-violet" : "rgba(106, 81, 255, 0.1)",
        "task-tag-text-violet" : "rgba(106, 81, 255, 1)",
        "task-tag-text-red" : "rgba(231, 73, 46, 1)",
        "task-tag-red" : "rgba(231, 73, 46, 0.1)",
        "task-tag-end-color" : "rgba(33, 33, 33, 0.4)",
        "task-file-attach" : " rgba(0, 122, 255, 0.08)",
        "task-file-attach-del" : "  rgba(231, 73, 46, 0.08)"
        
        


      },
      fontFamily:{
        'mono':['JetBrains Mono', 'sans-serif']
      },
      container:{
        padding:"2rem",
        center:true
      },
      screens:{
        sm:"640px",
        md:"768px"
      }
    },
  },
  plugins: [],
}


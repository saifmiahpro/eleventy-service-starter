export default function (eleventyConfig) {
  // Copy assets folder to output
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  
  // Watch for changes in assets
  eleventyConfig.addWatchTarget("./assets/");
  
  // Return directory configuration
  return {
    dir: {
      input: "src",
      includes: "_includes", 
      data: "_data",
      output: "_site"
    }
  };
};

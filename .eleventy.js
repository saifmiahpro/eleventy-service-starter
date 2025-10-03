export default function (eleventyConfig) {
  // Copy assets folder to output
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  
  // Copy offers previews to output
  eleventyConfig.addPassthroughCopy({ "offers/previews": "previews" });
  
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

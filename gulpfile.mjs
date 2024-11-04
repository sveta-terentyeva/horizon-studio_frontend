import gulp from "gulp";
import sassModule from "gulp-sass";
import * as sassCompiler from "sass";
const sass = sassModule(sassCompiler);
import browserSync from "browser-sync";
import rename from "gulp-rename";
import autoprefixer from "gulp-autoprefixer";
import notify from "gulp-notify";
import { rimraf } from "rimraf";
import plumber from "gulp-plumber";
import webpackStream from "webpack-stream";
import TerserPlugin from "terser-webpack-plugin";
import sourcemaps from "gulp-sourcemaps";
import nunjucksRender from "gulp-nunjucks-render";
import gulpif from "gulp-if";
import changed from "gulp-changed";
import prettify from "gulp-prettify";
import frontMatter from "gulp-front-matter";
import sharp from "gulp-sharp-optimize-images";
import gulpCache from "gulp-cache";
import svgo from "gulp-svgmin";
import merge from "merge-stream";

const cssPreprocessor = "sass"; // Syntax: sass or scss
const fileswatch = "txt,json,md,woff,woff2"; // List of files extensions for watching & hard reload (comma separated)

gulp.task("browser-sync", function () {
  browserSync({
    server: {
      baseDir: "app",
    },
    notify: false,
    open: false,
    ghostMode: false,
    // online: false, // Work Offline Without Internet Connection
    // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
  });
});

// Scripts
function scripts(mode = "development") {
  return gulp
    .src("app/js/src/scripts.js")
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Scripts",
            message: err.message,
          };
        }),
      })
    )
    .pipe(
      webpackStream({
        output: {
          filename: "common.js",
        },
        mode: mode,
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
          ],
        },
        optimization: {
          minimizer: [
            new TerserPlugin({
              extractComments: false,
              terserOptions: {
                format: {
                  comments: false,
                },
              },
            }),
          ],
        },
      })
    )
    .pipe(gulp.dest("app/js"))
    .pipe(browserSync.reload({ stream: true }));
}

gulp.task("scripts", function () {
  return scripts();
});

gulp.task("scriptsProduction", function () {
  return scripts("production");
});

// CSS
function styles(isProduction = false) {
  return gulp
    .src("app/" + cssPreprocessor + "/**/*." + cssPreprocessor + "")
    .pipe(gulpif(isProduction === false, sourcemaps.init()))
    .pipe(sass({ outputStyle: "compressed" }).on("error", notify.onError()))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer())
    .pipe(gulpif(isProduction === false, sourcemaps.write(".")))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
}

gulp.task("styles", function () {
  return styles();
});

gulp.task("stylesProduction", function (isProduction = true) {
  return styles(isProduction);
});

gulp.task("watch", function () {
  gulp.watch("app/" + cssPreprocessor + "/**/*", gulp.series("styles"));
  gulp.watch("app/js/src/**/*.js", gulp.series("scripts"));
  gulp.watch("app/img/_src", gulp.series("optImages"));
  gulp.watch("app/img/_original", gulp.series("optImages"));
  gulp.watch(["app/templates/**/[^_]*.njk"], gulp.parallel("nunjucks:changed"));
  gulp.watch(["app/templates/**/_*.njk"], gulp.parallel("nunjucks"));
  gulp.watch("app/**/*.{" + fileswatch + "}").on("change", browserSync.reload);
});

gulp.task("removedist", function () {
  return rimraf("dist/public");
});

gulp.task("buildFiles", function () {
  const html = gulp.src(["app/*.html"]).pipe(gulp.dest("dist/public"));

  const css = gulp
    .src(["app/css/main.min.css"])
    .pipe(gulp.dest("dist/public/css"));

  const fonts = gulp.src("app/fonts/**/*").pipe(gulp.dest("dist/public/fonts"));

  const js = gulp.src("app/js/common.js").pipe(gulp.dest("dist/public/js"));

  const images = gulp
    .src(["app/img/**/*", "!app/img/_src/**"])
    .pipe(gulp.dest("dist/public/img"));

  const video = gulp.src(["app/video/*"]).pipe(gulp.dest("dist/public/video"));

  return merge(html, css, fonts, js, images, video);
});

function renderHtml(onlyChanged) {
  nunjucksRender.nunjucks.configure({
    watch: false,
    trimBlocks: true,
    lstripBlocks: false,
  });

  return gulp
    .src(["app/templates/**/[^_]*.njk"])
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Templates",
            message: err.message,
          };
        }),
      })
    )
    .pipe(gulpif(onlyChanged, changed("app", { extension: ".html" })))
    .pipe(frontMatter({ property: "data" }))
    .pipe(
      nunjucksRender({
        // PRODUCTION: config.production,
        path: ["app/templates"],
      })
    )
    .pipe(
      prettify({
        indent_size: 2,
        wrap_attributes: "auto", // 'force'
        preserve_newlines: false,
        // unformatted: [],
        end_with_newline: true,
      })
    )
    .pipe(gulp.dest("app"))
    .pipe(browserSync.reload({ stream: true }));
}

gulp.task("nunjucks", function () {
  return renderHtml();
});

gulp.task("nunjucks:changed", function () {
  return renderHtml(true);
});

const SOURCE_RASTER_IMAGES = "app/img/_src/**/*.{jpg,jpeg,webp,avif}";
const SOURCE_RASTER_IMAGES_PNG = "app/img/_src/**/*.png";
const SOURCE_SVG_IMAGES = "app/img/_src/**/*.svg";
const SOURCE_ORIGINAL_IMAGES = "app/img/_original/**/*";
const DESTINATION_IMAGES = "app/img/_dist";

function optImages() {
  // Process raster images except PNG
  const rasterImages = gulp
    .src(SOURCE_RASTER_IMAGES)
    .pipe(
      sharp({
        // disable log
        logLevel: "",
        jpg_to_jpg: {
          quality: 75,
          mozjpeg: true,
          progressive: true,
        },
        webp: {
          quality: 75,
        },
      })
    )
    // Fix paths after using 'gulp-sharp-optimize-images'
    .pipe(
      rename((path) => {
        // Normalize directory paths
        path.dirname = path.dirname.replace(/\\/g, "/");
        // Additionally, normalize file base name if necessary
        path.basename = path.basename.replace(/\\/g, "/");
      })
    )
    // Output optimized JPG images
    .pipe(gulp.dest(DESTINATION_IMAGES));

  // Process PNG
  const pngImages = gulp
    .src(SOURCE_RASTER_IMAGES_PNG)
    .pipe(
      sharp({
        // disable log
        logLevel: "",
        png: {
          quality: 75,
          progressive: true,
        },
        webp: {
          quality: 75,
        },
      })
    )
    // Fix paths after using 'gulp-sharp-optimize-images'
    .pipe(
      rename((path) => {
        // Normalize directory paths
        path.dirname = path.dirname.replace(/\\/g, "/");
        // Additionally, normalize file base name if necessary
        path.basename = path.basename.replace(/\\/g, "/");
      })
    )
    // Output optimized PNG images
    .pipe(gulp.dest(DESTINATION_IMAGES));

  const svgImages = gulp
    .src(SOURCE_SVG_IMAGES)
    .pipe(
      svgo({
        configFile: "svgo.config.js",
      })
    )
    .pipe(gulp.dest(DESTINATION_IMAGES));

  const originalImages = gulp
    .src(SOURCE_ORIGINAL_IMAGES)
    .pipe(gulp.dest(DESTINATION_IMAGES));

  return merge(rasterImages, pngImages, svgImages, originalImages);
}

gulp.task("optImages", function () {
  return optImages();
});

gulp.task("clearcache", () => gulpCache.clearAll());

gulp.task(
  "default",
  gulp.series(
    "clearcache",
    "scripts",
    "styles",
    "nunjucks",
    "nunjucks:changed",
    "optImages",
    gulp.parallel("browser-sync", "watch")
  )
);

gulp.task(
  "build",
  gulp.series(
    "removedist",
    "clearcache",
    "scriptsProduction",
    "stylesProduction",
    "nunjucks",
    "nunjucks:changed",
    "optImages",
    "buildFiles"
  )
);

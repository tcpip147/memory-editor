module.exports = [
  {
    test: /\.jsx$/,
    exclude: {
      and: [/node_modules/]
    },
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          ["@babel/preset-react"]
        ]
      }
    }
  },
  {
    test: /\.s[ac]ss$/i,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      { loader: 'sass-loader' },
    ],
  },
  {
    test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg|eot|ttf|woff|woff2)$/i,
    type: 'asset',
    generator: {
      filename: 'assets/[hash][ext][query]',
    },
  },
];

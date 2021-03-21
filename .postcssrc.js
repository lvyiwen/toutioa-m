// module.exports = {
//   // 配置要使用的PostCss插件
//   plugins: {
//     // vuecil 内部已经配置了 autoprefixer插件
//     // 这里有配置了一次所以会报错
//     // autoprefixer: {
//     //   browsers: ['Android >= 4.0', 'iOS >= 8'],
//     // },
//     // 作用: 把px转换为rem
//     'postcss-pxtorem': {
//       rootValue: 37.5,
//       // 配置要转换的css属性
//       // *表示所有
//       propList: ['*'],
//     },
//   },
// };
module.exports = {
  plugins: {
    // vuecil 内部已经配置了 autoprefixer插件
    //     // 这里有配置了一次所以会报错
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8'],
    // },
    // 作用: 把px转换为rem
    'postcss-pxtorem': {
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // rootValue: 37.5,
      // 配置要转换的css属性
      //       // *表示所有
      propList: ['*'],
      exclude: 'github-markdown'
    }
  }
}

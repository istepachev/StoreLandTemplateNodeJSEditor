const a = 5;
const b = (str) => `Hello ${str}`;
// $(() => {
//   $(".header-sectionsLink").on("click", (evt) => {
//     evt.preventDefault();
//     const $link = $(evt.currentTarget);

//     $link.css({
//       background: "#ccc",
//     });
//   });
// });
console.log(b("Ivan"));
function foo(str) {
  return `${str}.js`;
}
console.log(`hello from '${foo("test")}'`);

const a = 5;
const b = (str) => `Hello ${str}`;
$(() => {
  $(".header-sectionsLink").on("click", (evt) => {
    evt.preventDefault();
    const $link = $(evt.currentTarget);

    $link.css({
      background: "#ccc",
    });
  });
});
// console.log(`hello`, `hello1`, 1111);
// console.log(1, 2, 3);
function foo(a) {
  return a - 1;
}
console.log(foo(5));

const bar = (b) => b - 1;
console.log(bar(11));

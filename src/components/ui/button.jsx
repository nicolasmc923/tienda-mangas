export function Button({ children, ...props }) {
  return <button className=" text-white px-4 py-2 rounded" {...props}>{children}</button>;
}
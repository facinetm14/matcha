import { ColorRing } from 'react-loader-spinner';

export function Loadder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ColorRing
        visible={true}
        height={80}
        width={80}
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e']}
      />
    </div>
  );
}

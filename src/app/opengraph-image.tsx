import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Data Visualize Designer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* 折れ線グラフアイコン */}
          <svg
            width="160"
            height="100"
            viewBox="0 0 160 100"
            style={{ marginRight: '16px' }}
          >
            <polyline
              points="0,70 40,50 80,20 120,40 160,0"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* テキスト */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#1e293b',
            }}
          >
            Data Visualize Designer
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

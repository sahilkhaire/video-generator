import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

interface IHealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ui')
  @Header('Content-Type', 'text/html')
  @ApiOperation({ summary: 'Simple API playground UI' })
  @ApiResponse({ status: 200, description: 'API playground page returned successfully' })
  getUi(): string {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Video Generation API Playground</title>
  <style>
    :root {
      --bg: #f6f4ef;
      --card: #fffdfa;
      --ink: #1b1f23;
      --muted: #5b6470;
      --line: #d8d2c7;
      --accent: #1f6feb;
      --accent-2: #0d4fb8;
      --good: #18794e;
      --bad: #b62324;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      color: var(--ink);
      font-family: "Avenir Next", Avenir, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 10% 0%, #efe6d6 0%, transparent 40%),
        radial-gradient(circle at 90% 10%, #e9f0ff 0%, transparent 35%),
        var(--bg);
      min-height: 100vh;
    }

    .wrap {
      max-width: 960px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.4rem, 3vw, 2rem);
      letter-spacing: 0.02em;
    }

    .sub {
      margin: 8px 0 0;
      color: var(--muted);
    }

    .card {
      margin-top: 16px;
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 10px 30px rgba(27, 31, 35, 0.06);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .full {
      grid-column: 1 / -1;
    }

    label {
      font-size: 0.92rem;
      color: var(--muted);
    }

    input,
    textarea,
    select,
    button {
      font: inherit;
      border-radius: 10px;
      border: 1px solid var(--line);
      padding: 10px 12px;
      background: #fff;
    }

    textarea {
      min-height: 84px;
      resize: vertical;
    }

    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 12px;
    }

    button {
      cursor: pointer;
      transition: transform 120ms ease, background 120ms ease;
    }

    button:hover {
      transform: translateY(-1px);
    }

    .primary {
      border-color: var(--accent);
      color: #fff;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      font-weight: 600;
    }

    pre {
      margin: 0;
      padding: 12px;
      border-radius: 10px;
      border: 1px solid var(--line);
      background: #fcfbf8;
      font-size: 0.88rem;
      overflow: auto;
      max-height: 320px;
    }

    .status {
      margin: 8px 0 0;
      font-size: 0.92rem;
      color: var(--muted);
    }

    .status.good {
      color: var(--good);
    }

    .status.bad {
      color: var(--bad);
    }

    @media (max-width: 760px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <h1>Video Generation API Playground</h1>
    <p class="sub">Use this page to enqueue jobs and check status through your current backend APIs.</p>

    <section class="card">
      <div class="grid">
        <div class="field full">
          <label for="apiKey">API Key (optional)</label>
          <input id="apiKey" placeholder="x-api-key header value" />
        </div>

        <div class="field full">
          <label for="samplePreset">Sample generation options</label>
          <select id="samplePreset"></select>
        </div>

        <div class="field full">
          <label for="topic">Topic</label>
          <textarea id="topic" required></textarea>
        </div>

        <div class="field">
          <label for="platform">Platform</label>
          <select id="platform">
            <option value="youtube">youtube</option>
            <option value="instagram_reels">instagram_reels</option>
            <option value="tiktok">tiktok</option>
          </select>
        </div>

        <div class="field">
          <label for="style">Style</label>
          <select id="style">
            <option value="cartoon">cartoon</option>
            <option value="realistic">realistic</option>
            <option value="animated">animated</option>
            <option value="cinematic">cinematic</option>
            <option value="minimal">minimal</option>
          </select>
        </div>

        <div class="field">
          <label for="targetDuration">Target duration (seconds)</label>
          <input id="targetDuration" type="number" min="15" max="600" value="45" />
        </div>

        <div class="field">
          <label for="targetAudience">Target audience</label>
          <input id="targetAudience" placeholder="e.g. startup founders" />
        </div>

        <div class="field">
          <label for="resolution">Resolution</label>
          <select id="resolution">
            <option value="480p">480p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </select>
        </div>

        <div class="field">
          <label for="fps">FPS</label>
          <input id="fps" type="number" min="24" max="60" value="30" />
        </div>

        <div class="field full">
          <label for="additionalContext">Additional context</label>
          <textarea id="additionalContext" placeholder="Optional extra instructions for generation"></textarea>
        </div>
      </div>

      <div class="actions">
        <button class="primary" id="enqueueBtn">Enqueue Video Job</button>
        <button id="providersBtn">Get Active Providers</button>
      </div>
      <p id="requestStatus" class="status"></p>
    </section>

    <section class="card">
      <div class="grid">
        <div class="field">
          <label for="jobId">Job ID</label>
          <input id="jobId" placeholder="Paste jobId to poll status" />
        </div>
      </div>
      <div class="actions">
        <button id="jobStatusBtn">Get Job Status</button>
      </div>
    </section>

    <section class="card">
      <h3>Response</h3>
      <pre id="output">{ "message": "Ready" }</pre>
    </section>
  </main>

  <script>
    const samples = [
      {
        label: 'Productivity Tips (YouTube)',
        topic: 'Practical time-blocking techniques that remote founders can apply in under one week',
        platform: 'youtube',
        style: 'animated',
        targetDuration: 75,
        targetAudience: 'remote startup founders',
        additionalContext: 'Keep examples concrete and include one cautionary anti-pattern.',
        resolution: '1080p',
        fps: 30,
      },
      {
        label: 'AI Myth Busting (Instagram)',
        topic: 'Three myths about generative AI replacing all jobs, explained with realistic scenarios',
        platform: 'instagram_reels',
        style: 'cinematic',
        targetDuration: 45,
        targetAudience: 'college students exploring tech careers',
        additionalContext: 'Tone should be optimistic but not hype-driven.',
        resolution: '720p',
        fps: 30,
      },
      {
        label: 'Science Quick Explainer (TikTok)',
        topic: 'Why sunsets look red using simple analogies and one memorable visual metaphor',
        platform: 'tiktok',
        style: 'cartoon',
        targetDuration: 30,
        targetAudience: 'curious teens and general audience',
        additionalContext: 'Make the hook strong in first 3 seconds and close with a surprising fact.',
        resolution: '720p',
        fps: 30,
      },
    ];

    const refs = {
      apiKey: document.getElementById('apiKey'),
      samplePreset: document.getElementById('samplePreset'),
      topic: document.getElementById('topic'),
      platform: document.getElementById('platform'),
      style: document.getElementById('style'),
      targetDuration: document.getElementById('targetDuration'),
      targetAudience: document.getElementById('targetAudience'),
      additionalContext: document.getElementById('additionalContext'),
      resolution: document.getElementById('resolution'),
      fps: document.getElementById('fps'),
      requestStatus: document.getElementById('requestStatus'),
      output: document.getElementById('output'),
      jobId: document.getElementById('jobId'),
      enqueueBtn: document.getElementById('enqueueBtn'),
      providersBtn: document.getElementById('providersBtn'),
      jobStatusBtn: document.getElementById('jobStatusBtn'),
    };

    function setStatus(message, ok = true) {
      refs.requestStatus.textContent = message;
      refs.requestStatus.className = ok ? 'status good' : 'status bad';
    }

    function writeOutput(payload) {
      refs.output.textContent = JSON.stringify(payload, null, 2);
    }

    function authHeaders() {
      const apiKey = refs.apiKey.value.trim();
      return apiKey ? { 'x-api-key': apiKey } : {};
    }

    function applySample(sample) {
      refs.topic.value = sample.topic;
      refs.platform.value = sample.platform;
      refs.style.value = sample.style;
      refs.targetDuration.value = String(sample.targetDuration);
      refs.targetAudience.value = sample.targetAudience;
      refs.additionalContext.value = sample.additionalContext;
      refs.resolution.value = sample.resolution;
      refs.fps.value = String(sample.fps);
    }

    function getPayload() {
      return {
        topic: refs.topic.value.trim(),
        platform: refs.platform.value,
        style: refs.style.value,
        targetDuration: Number(refs.targetDuration.value),
        targetAudience: refs.targetAudience.value.trim() || undefined,
        additionalContext: refs.additionalContext.value.trim() || undefined,
        resolution: refs.resolution.value,
        fps: Number(refs.fps.value),
      };
    }

    async function callApi(path, options = {}) {
      const response = await fetch(path, {
        ...options,
        headers: {
          'content-type': 'application/json',
          ...authHeaders(),
          ...(options.headers || {}),
        },
      });

      const body = await response.json().catch(() => ({ message: 'No JSON body returned' }));
      if (!response.ok) {
        throw { status: response.status, body };
      }
      return body;
    }

    samples.forEach((sample, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = sample.label;
      refs.samplePreset.appendChild(option);
    });

    refs.samplePreset.addEventListener('change', (event) => {
      const idx = Number(event.target.value);
      applySample(samples[idx]);
      setStatus('Sample option applied.', true);
    });

    refs.enqueueBtn.addEventListener('click', async () => {
      const payload = getPayload();

      if (payload.topic.length < 10) {
        setStatus('Topic must be at least 10 characters.', false);
        return;
      }

      try {
        setStatus('Submitting generation request...');
        writeOutput({ request: payload });
        const result = await callApi('/api/videos/generate', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (result && result.jobId) {
          refs.jobId.value = result.jobId;
        }

        setStatus('Job enqueued successfully.', true);
        writeOutput(result);
      } catch (error) {
        setStatus('Failed to enqueue job.', false);
        writeOutput(error);
      }
    });

    refs.providersBtn.addEventListener('click', async () => {
      try {
        setStatus('Loading providers...');
        const result = await callApi('/api/videos/providers', { method: 'GET' });
        setStatus('Active providers loaded.', true);
        writeOutput(result);
      } catch (error) {
        setStatus('Failed to load providers.', false);
        writeOutput(error);
      }
    });

    refs.jobStatusBtn.addEventListener('click', async () => {
      const id = refs.jobId.value.trim();
      if (!id) {
        setStatus('Please enter a job ID first.', false);
        return;
      }

      try {
        setStatus('Fetching job status...');
        const result = await callApi('/api/videos/jobs/' + encodeURIComponent(id), {
          method: 'GET',
        });
        setStatus('Job status loaded.', true);
        writeOutput(result);
      } catch (error) {
        setStatus('Failed to fetch job status.', false);
        writeOutput(error);
      }
    });

    applySample(samples[0]);
    refs.samplePreset.value = '0';
  </script>
</body>
</html>`;
  }

  @Get()
  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({ status: 200, description: 'API information returned successfully' })
  getInfo(): { message: string; version: string } {
    return this.appService.getInfo();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth(): IHealthResponse {
    return this.appService.getHealth();
  }
}

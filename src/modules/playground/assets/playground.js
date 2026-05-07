const samples = [
  {
    label: 'Indian Founders (YouTube)',
    topic: 'How first-time Indian founders can validate startup ideas in 7 days with minimal budget',
    platform: 'youtube',
    style: 'animated',
    targetDuration: 75,
    targetAudience: 'early-stage Indian founders',
    additionalContext: 'Use practical Indian market examples and one strong CTA.',
    resolution: '1080p',
    aspectRatio: '16:9',
    fps: 30,
  },
  {
    label: 'UPSC Learning (Instagram)',
    topic: 'How to remember constitutional articles using visual memory hacks and storytelling',
    platform: 'instagram_reels',
    style: 'cinematic',
    targetDuration: 45,
    targetAudience: 'UPSC aspirants',
    additionalContext: 'Keep narration concise and motivational.',
    resolution: '720p',
    aspectRatio: '9:16',
    fps: 30,
  },
  {
    label: 'Cricket Physics (TikTok)',
    topic: 'Why a cricket ball swings: explain seam, pressure difference, and release angle in simple terms',
    platform: 'tiktok',
    style: 'cartoon',
    targetDuration: 30,
    targetAudience: 'teens and sports fans',
    additionalContext: 'Open with a hook and close with a challenge question.',
    resolution: '720p',
    aspectRatio: '9:16',
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
  aspectRatio: document.getElementById('aspectRatio'),
  fps: document.getElementById('fps'),
  voice: document.getElementById('voice'),
  loadVoicesBtn: document.getElementById('loadVoicesBtn'),
  providersBtn: document.getElementById('providersBtn'),
  enqueueBtn: document.getElementById('enqueueBtn'),
  jobStatusBtn: document.getElementById('jobStatusBtn'),
  jobId: document.getElementById('jobId'),
  mongoJobLimit: document.getElementById('mongoJobLimit'),
  mongoCostLimit: document.getElementById('mongoCostLimit'),
  mongoDetailsBtn: document.getElementById('mongoDetailsBtn'),
  mongoSummary: document.getElementById('mongoSummary'),
  mongoJobsTable: document.getElementById('mongoJobsTable'),
  mongoCostTable: document.getElementById('mongoCostTable'),
  requestStatus: document.getElementById('requestStatus'),
  output: document.getElementById('output'),
  menu: document.getElementById('menu'),
};

function setStatus(message, level) {
  refs.requestStatus.textContent = message;
  refs.requestStatus.className = 'status ' + (level || 'good');
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
  refs.aspectRatio.value = sample.aspectRatio || '16:9';
  refs.fps.value = String(sample.fps);
}

function getPayload() {
  const voice = refs.voice.value.trim();
  return {
    topic: refs.topic.value.trim(),
    platform: refs.platform.value,
    style: refs.style.value,
    targetDuration: Number(refs.targetDuration.value),
    targetAudience: refs.targetAudience.value.trim() || undefined,
    additionalContext: refs.additionalContext.value.trim() || undefined,
    resolution: refs.resolution.value,
    aspectRatio: refs.aspectRatio.value,
    fps: Number(refs.fps.value),
    voice: voice || undefined,
  };
}

async function callApi(path, options) {
  const response = await fetch(path, {
    ...(options || {}),
    headers: {
      'content-type': 'application/json',
      ...authHeaders(),
      ...((options && options.headers) || {}),
    },
  });

  const body = await response.json().catch(() => ({ message: 'No JSON body returned' }));
  if (!response.ok) {
    throw { status: response.status, body };
  }
  return body;
}

function setMenuActive(targetId) {
  refs.menu.querySelectorAll('button').forEach((btn) => {
    if (btn.getAttribute('data-target') === targetId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

function fillTable(tableEl, rows, emptyCols, renderRow) {
  const tbody = tableEl.querySelector('tbody');
  tbody.innerHTML = '';

  if (!rows || rows.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = emptyCols;
    td.textContent = 'No records found.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  rows.forEach((row) => tbody.appendChild(renderRow(row)));
}

function renderJobRow(job) {
  const tr = document.createElement('tr');
  const cols = [
    job.jobId || '-',
    job.status || '-',
    job.platform || '-',
    String(job.progress ?? 0) + '%',
    formatDate(job.createdAt),
  ];

  cols.forEach((value) => {
    const td = document.createElement('td');
    td.textContent = value;
    tr.appendChild(td);
  });

  return tr;
}

function renderCostRow(record) {
  const tr = document.createElement('tr');
  const cols = [
    record.provider || '-',
    record.contentType || '-',
    Number(record.estimatedCostUsd || 0).toFixed(4),
    String(record.durationMs ?? 0),
    record.success ? 'yes' : 'no',
    formatDate(record.timestamp),
  ];

  cols.forEach((value) => {
    const td = document.createElement('td');
    td.textContent = value;
    tr.appendChild(td);
  });

  return tr;
}

refs.menu.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-target]');
  if (!button) return;
  const target = button.getAttribute('data-target');
  const section = document.getElementById(target);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuActive(target);
  }
});

samples.forEach((sample, index) => {
  const option = document.createElement('option');
  option.value = String(index);
  option.textContent = sample.label;
  refs.samplePreset.appendChild(option);
});

refs.samplePreset.addEventListener('change', (event) => {
  const idx = Number(event.target.value);
  applySample(samples[idx]);
  setStatus('Preset applied.', 'good');
});

refs.platform.addEventListener('change', () => {
  if (refs.platform.value === 'instagram_reels' && refs.aspectRatio.value === '16:9') {
    refs.aspectRatio.value = '9:16';
  }
});

refs.loadVoicesBtn.addEventListener('click', async () => {
  try {
    setStatus('Loading voices...', 'warn');
    const voices = await callApi('/api/videos/tts-voices', { method: 'GET' });
    const selected = refs.voice.value;
    refs.voice.innerHTML = '<option value="">Use Provider Default</option>';

    const indian = voices.filter((v) => v.indian);
    const other = voices.filter((v) => !v.indian);

    if (indian.length > 0) {
      const group = document.createElement('optgroup');
      group.label = 'Indian Voices';
      indian.forEach((v) => {
        const option = document.createElement('option');
        option.value = v.id;
        option.textContent = v.name + ' - ' + v.language;
        group.appendChild(option);
      });
      refs.voice.appendChild(group);
    }

    if (other.length > 0) {
      const group = document.createElement('optgroup');
      group.label = 'Other Voices';
      other.forEach((v) => {
        const option = document.createElement('option');
        option.value = v.id;
        option.textContent = v.name + ' - ' + v.language;
        group.appendChild(option);
      });
      refs.voice.appendChild(group);
    }

    refs.voice.value = selected;
    setStatus('Voices loaded: ' + voices.length, 'good');
    writeOutput(voices);
  } catch (error) {
    setStatus('Failed to load voices.', 'bad');
    writeOutput(error);
  }
});

refs.providersBtn.addEventListener('click', async () => {
  try {
    setStatus('Loading active providers...', 'warn');
    const result = await callApi('/api/videos/providers', { method: 'GET' });
    setStatus('Providers loaded.', 'good');
    writeOutput(result);
  } catch (error) {
    setStatus('Failed to load providers.', 'bad');
    writeOutput(error);
  }
});

refs.enqueueBtn.addEventListener('click', async () => {
  const payload = getPayload();
  if (payload.topic.length < 10) {
    setStatus('Topic must be at least 10 characters.', 'bad');
    return;
  }

  try {
    setStatus('Submitting generation request...', 'warn');
    writeOutput({ request: payload });
    const result = await callApi('/api/videos/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (result && result.jobId) {
      refs.jobId.value = result.jobId;
    }

    setStatus('Job enqueued successfully.', 'good');
    writeOutput(result);
  } catch (error) {
    setStatus('Failed to enqueue job.', 'bad');
    writeOutput(error);
  }
});

refs.jobStatusBtn.addEventListener('click', async () => {
  const id = refs.jobId.value.trim();
  if (!id) {
    setStatus('Enter a job ID first.', 'bad');
    return;
  }

  try {
    setStatus('Fetching job status...', 'warn');
    const result = await callApi('/api/videos/jobs/' + encodeURIComponent(id), { method: 'GET' });
    setStatus('Job status loaded.', 'good');
    writeOutput(result);
  } catch (error) {
    setStatus('Failed to fetch job status.', 'bad');
    writeOutput(error);
  }
});

refs.mongoDetailsBtn.addEventListener('click', async () => {
  const jobLimit = Number(refs.mongoJobLimit.value || '50');
  const costLimit = Number(refs.mongoCostLimit.value || '100');

  try {
    setStatus('Loading MongoDB details...', 'warn');
    const query = new URLSearchParams({
      jobLimit: String(jobLimit),
      costLimit: String(costLimit),
    });
    const result = await callApi('/api/videos/mongo-details?' + query.toString(), {
      method: 'GET',
    });

    fillTable(refs.mongoJobsTable, result.videoJobs || [], 5, renderJobRow);
    fillTable(refs.mongoCostTable, result.costRecords || [], 6, renderCostRow);

    const jobsCount = result.totals?.videoJobs ?? 0;
    const costCount = result.totals?.costRecords ?? 0;
    refs.mongoSummary.textContent = 'Loaded ' + jobsCount + ' jobs and ' + costCount + ' cost records.';
    refs.mongoSummary.className = 'status good';

    setStatus('MongoDB details loaded.', 'good');
    writeOutput(result);
  } catch (error) {
    refs.mongoSummary.textContent = 'Failed to load MongoDB details.';
    refs.mongoSummary.className = 'status bad';
    setStatus('Failed to load MongoDB details.', 'bad');
    writeOutput(error);
  }
});

refs.samplePreset.value = '0';
applySample(samples[0]);

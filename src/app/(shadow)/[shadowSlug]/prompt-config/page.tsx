import { db } from '@/lib/db'
import { siteSettings } from '../../../../../database/schema'
import { eq } from 'drizzle-orm'
import PromptConfigEditor from '@/components/shadow/PromptConfigEditor'
import { DEFAULT_SYSTEM_PROMPT } from '@/config/ai-prompts'

export default async function PromptConfigPage() {
  let setting: typeof siteSettings.$inferSelect | undefined

  try {
    setting = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.key, 'ai_system_prompt'),
    })
  } catch {
    // DB unavailable
  }

  const currentPrompt = setting?.value || ''

  return (
    <div className="max-w-3xl">
      <h1 className="text-sm font-mono text-gray-400 mb-2">{'// prompt_config'}</h1>
      <p className="text-xs text-gray-600 font-mono mb-6">
        Prompt dang dung: {currentPrompt ? 'custom (DB)' : 'default (src/config/ai-prompts.ts)'}
      </p>

      <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-xs font-mono text-gray-500 mb-2">{'// default_prompt (readonly)'}</p>
        <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto">
          {DEFAULT_SYSTEM_PROMPT}
        </pre>
      </div>

      <PromptConfigEditor currentPrompt={currentPrompt} defaultPrompt={DEFAULT_SYSTEM_PROMPT} />
    </div>
  )
}

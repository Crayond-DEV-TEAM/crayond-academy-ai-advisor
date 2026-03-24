'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TemplateVarPanel, { PanelTitle, VarOpBtnGroup } from '../value-panel'
import FileUploaderInAttachmentWrapper from '../base/file-uploader-in-attachment'
import { AppInfoComp, ChatBtn, EditBtn, PromptTemplate } from './massive-component'
import type { AppInfo, PromptConfig } from '@/types/app'
import Toast from '@/app/components/base/toast'
import * as RadixSelect from '@radix-ui/react-select'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'

// regex to match the {{}} and replace it with a span
const regex = /\{\{([^}]+)\}\}/g

export interface IWelcomeProps {
  conversationName: string
  hasSetInputs: boolean
  isPublicVersion: boolean
  siteInfo: AppInfo
  promptConfig: PromptConfig
  onStartChat: (inputs: Record<string, any>) => void
  canEditInputs: boolean
  savedInputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
}

const Welcome: FC<IWelcomeProps> = ({
  conversationName,
  hasSetInputs,
  isPublicVersion,
  siteInfo,
  promptConfig,
  onStartChat,
  canEditInputs,
  savedInputs,
  onInputsChange,
}) => {
  const { t } = useTranslation()
  const hasVar = promptConfig.prompt_variables.length > 0
  const [isFold, setIsFold] = useState<boolean>(true)
  const [inputs, setInputs] = useState<Record<string, any>>((() => {
    if (hasSetInputs) { return savedInputs }

    const res: Record<string, any> = {}
    if (promptConfig) {
      promptConfig.prompt_variables.forEach((item) => {
        res[item.key] = ''
      })
    }
    return res
  })())
  useEffect(() => {
    if (!savedInputs) {
      const res: Record<string, any> = {}
      if (promptConfig) {
        promptConfig.prompt_variables.forEach((item) => {
          res[item.key] = ''
        })
      }
      setInputs(res)
    }
    else {
      setInputs(savedInputs)
    }
  }, [savedInputs])

  const highLightPromoptTemplate = (() => {
    if (!promptConfig) { return '' }
    const res = promptConfig.prompt_template.replace(regex, (match, p1) => {
      return `<span class='text-gray-800 font-bold'>${inputs?.[p1] ? inputs?.[p1] : match}</span>`
    })
    return res
  })()

  const { notify } = Toast
  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const renderHeader = () => {
    // Hidden in single-conversation mode — no conversation name needed
    return null
  }

  const renderInputs = () => {
    const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#665cd7]/50 focus:bg-white/[0.06] transition-colors'

    return (
      <div className='space-y-4'>
        {promptConfig.prompt_variables.map(item => (
          <div className='space-y-1.5' key={item.key}>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              {item.name}
              {item.required !== false && <span className="text-red-400 ml-0.5">*</span>}
              {item.required === false && <span className="text-gray-600 normal-case tracking-normal ml-1">({t('app.variableTable.optional')})</span>}
            </label>
            {item.type === 'select'
              && (
                <RadixSelect.Root value={inputs?.[item.key] || undefined} onValueChange={(val) => { setInputs({ ...inputs, [item.key]: val }) }}>
                  <RadixSelect.Trigger
                    className={`group w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm flex items-center justify-between outline-none transition-colors data-[state=open]:border-[#665cd7]/50 data-[state=open]:bg-white/[0.06] hover:border-white/[0.15] ${inputs?.[item.key] ? 'text-white' : 'text-gray-500'}`}
                  >
                    <span className="flex-1 min-w-0 truncate text-left">
                      <RadixSelect.Value placeholder="Select..." />
                    </span>
                    <RadixSelect.Icon asChild>
                      <svg
                        className="w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </RadixSelect.Icon>
                  </RadixSelect.Trigger>
                  <RadixSelect.Portal>
                    <RadixSelect.Content
                      position="popper"
                      sideOffset={6}
                      className="z-[9999] w-[var(--radix-select-trigger-width)] rounded-xl bg-[#1e1d2e] border border-white/[0.08] shadow-xl shadow-black/40 overflow-hidden"
                    >
                      <RadixSelect.Viewport>
                        {(item.options || []).map(opt => (
                          <RadixSelect.Item
                            key={opt}
                            value={opt}
                            className="px-4 py-2.5 text-sm text-gray-300 outline-none cursor-pointer transition-colors data-[highlighted]:bg-white/[0.06] data-[highlighted]:text-white data-[state=checked]:bg-[#665cd7]/20 data-[state=checked]:text-[#a89df0]"
                          >
                            <RadixSelect.ItemText>{opt}</RadixSelect.ItemText>
                          </RadixSelect.Item>
                        ))}
                      </RadixSelect.Viewport>
                    </RadixSelect.Content>
                  </RadixSelect.Portal>
                </RadixSelect.Root>
              )}
            {item.type === 'string' && (
              <input
                placeholder={item.name}
                value={inputs?.[item.key] || ''}
                onChange={(e) => { setInputs({ ...inputs, [item.key]: e.target.value }) }}
                className={inputClass}
                maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
              />
            )}
            {item.type === 'paragraph' && (
              <textarea
                className={`${inputClass} h-[104px]`}
                placeholder={item.name}
                value={inputs?.[item.key] || ''}
                onChange={(e) => { setInputs({ ...inputs, [item.key]: e.target.value }) }}
              />
            )}
            {item.type === 'number' && (
              <input
                type="number"
                className={inputClass}
                placeholder={item.name}
                value={inputs[item.key]}
                onChange={(e) => { onInputsChange({ ...inputs, [item.key]: e.target.value }) }}
              />
            )}

            {
              item.type === 'file' && (
                <FileUploaderInAttachmentWrapper
                  fileConfig={{
                    allowed_file_types: item.allowed_file_types,
                    allowed_file_extensions: item.allowed_file_extensions,
                    allowed_file_upload_methods: item.allowed_file_upload_methods!,
                    number_limits: 1,
                    fileUploadConfig: {} as any,
                  }}
                  onChange={(files) => {
                    setInputs({ ...inputs, [item.key]: files[0] })
                  }}
                  value={inputs?.[item.key] || []}
                />
              )
            }
            {
              item.type === 'file-list' && (
                <FileUploaderInAttachmentWrapper
                  fileConfig={{
                    allowed_file_types: item.allowed_file_types,
                    allowed_file_extensions: item.allowed_file_extensions,
                    allowed_file_upload_methods: item.allowed_file_upload_methods!,
                    number_limits: item.max_length,
                    fileUploadConfig: {} as any,
                  }}
                  onChange={(files) => {
                    setInputs({ ...inputs, [item.key]: files })
                  }}
                  value={inputs?.[item.key] || []}
                />
              )
            }
          </div>
        ))}
      </div>
    )
  }

  const canChat = () => {
    const inputLens = Object.values(inputs).length
    const promptVariablesLens = promptConfig.prompt_variables.length
    const emptyInput = inputLens < promptVariablesLens || Object.entries(inputs).filter(([k, v]) => {
      const isRequired = promptConfig.prompt_variables.find(item => item.key === k)?.required ?? true
      return isRequired && v === ''
    }).length > 0
    if (emptyInput) {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  const handleChat = () => {
    if (!canChat()) { return }

    onStartChat(inputs)
  }

  const renderNoVarPanel = () => {
    if (isPublicVersion) {
      return (
        <div>
          <AppInfoComp siteInfo={siteInfo} />
          <TemplateVarPanel
            isFold={false}
            header={
              <>
                <PanelTitle
                  title={t('app.chat.publicPromptConfigTitle')}
                  className='mb-1'
                />
                <PromptTemplate html={highLightPromoptTemplate} />
              </>
            }
          >
            <ChatBtn onClick={handleChat} />
          </TemplateVarPanel>
        </div>
      )
    }
    // private version
    return (
      <TemplateVarPanel
        isFold={false}
        header={
          <AppInfoComp siteInfo={siteInfo} />
        }
      >
        <ChatBtn onClick={handleChat} />
      </TemplateVarPanel>
    )
  }

  const renderVarPanel = () => {
    return (
      <TemplateVarPanel
        isFold={false}
        header={
          <AppInfoComp siteInfo={siteInfo} />
        }
      >
        {renderInputs()}
        <ChatBtn
          className='mt-4'
          onClick={handleChat}
        />
      </TemplateVarPanel>
    )
  }

  const renderVarOpBtnGroup = () => {
    return (
      <VarOpBtnGroup
        onConfirm={() => {
          if (!canChat()) { return }

          onInputsChange(inputs)
          setIsFold(true)
        }}
        onCancel={() => {
          setInputs(savedInputs)
          setIsFold(true)
        }}
      />
    )
  }

  const renderHasSetInputsPublic = () => {
    if (!canEditInputs) {
      return (
        <TemplateVarPanel
          isFold={false}
          header={
            <>
              <PanelTitle
                title={t('app.chat.publicPromptConfigTitle')}
                className='mb-1'
              />
              <PromptTemplate html={highLightPromoptTemplate} />
            </>
          }
        />
      )
    }

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <>
            <PanelTitle
              title={t('app.chat.publicPromptConfigTitle')}
              className='mb-1'
            />
            <PromptTemplate html={highLightPromoptTemplate} />
            {isFold && (
              <div className='flex items-center justify-between mt-3 border-t border-white/[0.06] pt-4 text-xs text-[#a89df0]'>
                <span className='text-gray-400'>{t('app.chat.configStatusDes')}</span>
                <EditBtn onClick={() => setIsFold(false)} />
              </div>
            )}
          </>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    )
  }

  const renderHasSetInputsPrivate = () => {
    if (!canEditInputs || !hasVar) { return null }

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <div className='flex items-center justify-between text-[#a89df0]'>
            <PanelTitle
              title={!isFold ? t('app.chat.privatePromptConfigTitle') : t('app.chat.configStatusDes')}
            />
            {isFold && (
              <EditBtn onClick={() => setIsFold(false)} />
            )}
          </div>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    )
  }

  const renderHasSetInputs = () => {
    if (!hasVar || !canEditInputs) { return null }

    return (
      <div className='flex justify-center py-2'>
        {isFold
          ? (
            <button
              type="button"
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-gray-400 hover:text-[#a89df0] hover:border-[#665cd7]/30 transition-colors'
              onClick={() => setIsFold(false)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Edit your details
            </button>
          )
          : (
            <div className='w-full max-w-xl px-4'>
              <div className='rounded-xl border border-white/[0.08] bg-white/[0.02] p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-xs font-medium text-gray-400'>Edit your details</span>
                  <button
                    type="button"
                    className='text-xs text-gray-500 hover:text-gray-300 transition-colors'
                    onClick={() => { setInputs(savedInputs); setIsFold(true) }}
                  >Cancel</button>
                </div>
                {renderInputs()}
                <div className='mt-3 flex justify-end'>
                  <button
                    type="button"
                    className='px-4 py-2 rounded-lg bg-[#665cd7] text-white text-xs font-medium hover:bg-[#5a51c4] transition-colors'
                    onClick={() => {
                      if (!canChat()) { return }
                      onInputsChange(inputs)
                      setIsFold(true)
                    }}
                  >Save</button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }

  return (
    <div className='relative'>
      {hasSetInputs && renderHeader()}
      <div className='mx-auto max-w-xl w-full px-4'>
        {/*  Has't set inputs  */}
        {
          !hasSetInputs && (
            <div className='pt-2 tablet:pt-4 relative'>
              <div className="brand-glow top-0 right-0 -translate-y-1/2 translate-x-1/4" />
              {hasVar
                ? (
                  renderVarPanel()
                )
                : (
                  renderNoVarPanel()
                )}
            </div>
          )
        }

        {/* Has set inputs */}
        {hasSetInputs && renderHasSetInputs()}

        {/* foot */}
        {!hasSetInputs && siteInfo.privacy_policy && (
          <div className='mt-4 flex justify-center items-center h-8 text-xs text-gray-600'>
            <div>{t('app.chat.privacyPolicyLeft')}
              <a
                className='text-gray-500 hover:text-[#a89df0] transition-colors'
                href={siteInfo.privacy_policy}
                target='_blank'
              >{t('app.chat.privacyPolicyMiddle')}</a>
              {t('app.chat.privacyPolicyRight')}
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

export default React.memo(Welcome)
